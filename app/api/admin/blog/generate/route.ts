import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const FAL_API_KEY = process.env.FAL_KEY || ''

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || ''
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || ''
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || ''
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || ''
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || ''

const r2Client = R2_ACCESS_KEY_ID ? new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
}) : null

const SYSTEM_PROMPT = `You are a senior content writer for VoxClouds (voxclouds.com), a cloud business phone system and international VoIP platform. You write expert-level blog posts that help businesses understand cloud telephony, VoIP, and communication technology.

IMPORTANT RULES:
- Write in a natural, authoritative tone — like a telecom industry expert writing for a business audience
- NEVER use phrases like "in conclusion", "in today's world", "in this article we will", "it's worth noting", "let's dive in", "without further ado", "navigating", "landscape", "game-changer", "harness the power", "dive deep", "at the end of the day", "a]myriad of", "it goes without saying" or similar AI-tell patterns
- NEVER refer to yourself as AI or mention that content is AI-generated
- Use short paragraphs (2-3 sentences max), varied sentence length, and direct language
- Include specific numbers, examples, and practical advice — not vague generalities
- Naturally mention VoxClouds features where relevant (cloud PBX, free internal calls, virtual numbers in 60+ countries, AI IVR in 70+ languages, outbound campaign tools, $5/mo pricing, browser-based softphone)
- Include 2-3 internal links using HTML anchor tags to relevant VoxClouds pages:
  * /cloud-pbx — for PBX/phone system topics
  * /virtual-numbers — for DID/virtual number topics
  * /international-calling — for calling rate topics
  * /pricing — for cost comparison topics
  * /rates — for rate lookup
  * /wholesale-voip — for carrier/reseller topics
- Structure with H2 and H3 headings (as HTML tags)
- Include a FAQ section at the end with 3-4 questions in H3 tags
- Target 1000-1500 words
- Write for a global audience (mention regions like Middle East, Africa, South Asia, UK, USA)

RESPONSE FORMAT — return valid JSON only, no markdown wrapping, no code fences:
{
  "title": "SEO-optimized title (50-65 chars)",
  "slug": "url-friendly-slug",
  "excerpt": "Compelling 1-2 sentence summary for blog list (under 160 chars)",
  "content": "Full HTML content with h2, h3, p, ul, li, a, strong tags",
  "meta_title": "SEO title with brand — max 60 chars | VoxClouds",
  "meta_description": "SEO meta description 150-160 chars with primary keyword",
  "meta_keywords": "comma,separated,seo,keywords,5-10 terms",
  "image_prompt": "A short prompt for generating a professional blog cover image (describe a modern tech/business scene, NO text in image, photorealistic style)"
}`

const USER_PROMPT_PREFIX = 'Write a blog post about:'

type ModelId = 'claude-haiku-4-5-20251001' | 'gpt-4o' | 'gpt-4o-mini' | 'gemini-2.0-flash' | 'gemini-2.5-pro-preview-06-05'

interface ModelConfig {
  provider: 'anthropic' | 'openai' | 'gemini'
  label: string
}

const MODEL_MAP: Record<ModelId, ModelConfig> = {
  'gpt-4o': { provider: 'openai', label: 'GPT-4o' },
  'claude-haiku-4-5-20251001': { provider: 'anthropic', label: 'Claude Haiku 4.5' },
  'gpt-4o-mini': { provider: 'openai', label: 'GPT-4o Mini' },
  'gemini-2.5-pro-preview-06-05': { provider: 'gemini', label: 'Gemini 2.5 Pro' },
  'gemini-2.0-flash': { provider: 'gemini', label: 'Gemini 2.0 Flash' },
}

async function callOpenAI(model: string, topic: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `${USER_PROMPT_PREFIX} ${topic}` },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`OpenAI: ${err.error?.message || res.statusText}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

async function callAnthropic(model: string, topic: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: `${USER_PROMPT_PREFIX} ${topic}` },
      ],
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Anthropic: ${err.error?.message || res.statusText}`)
  }
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

async function callGemini(model: string, topic: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: `${USER_PROMPT_PREFIX} ${topic}` }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4000,
      },
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Gemini: ${err.error?.message || res.statusText}`)
  }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function uploadToR2(imageUrl: string, slug: string): Promise<string> {
  if (!r2Client || !R2_BUCKET_NAME) return imageUrl

  try {
    const res = await fetch(imageUrl)
    if (!res.ok) return imageUrl

    const buffer = Buffer.from(await res.arrayBuffer())
    const contentType = res.headers.get('content-type') || 'image/webp'
    const ext = contentType.includes('png') ? 'png' : contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'webp'
    const key = `voxclouds/blog/${slug}-${Date.now()}.${ext}`

    await r2Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }))

    return `${R2_PUBLIC_URL}/${key}`
  } catch {
    return imageUrl
  }
}

async function generateImage(prompt: string, slug: string = 'blog'): Promise<string> {
  if (!FAL_API_KEY) return ''

  try {
    const falRes = await fetch('https://queue.fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${FAL_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        image_size: 'landscape_16_9',
        num_images: 1,
        enable_safety_checker: true,
      }),
    })

    if (!falRes.ok) return ''

    const falData = await falRes.json()
    let falImageUrl = falData.images?.[0]?.url || ''

    // Queue mode — poll for result using response_url from fal
    if (!falImageUrl) {
      const pollUrl = falData.response_url || (falData.request_id ? `https://queue.fal.run/fal-ai/flux/schnell/requests/${falData.request_id}` : '')
      if (pollUrl) {
        for (let i = 0; i < 30; i++) {
          await new Promise(r => setTimeout(r, 2000))
          const statusRes = await fetch(pollUrl, {
            headers: { 'Authorization': `Key ${FAL_API_KEY}` },
          })
          if (statusRes.ok) {
            const statusData = await statusRes.json()
            if (statusData.images?.[0]?.url) {
              falImageUrl = statusData.images[0].url
              break
            }
            if (statusData.status === 'FAILED') break
          }
        }
      }
    }

    // Upload to R2 for permanent storage
    if (falImageUrl) {
      return await uploadToR2(falImageUrl, slug)
    }
  } catch { /* continue without image */ }
  return ''
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { topic, model: modelId } = await req.json()
  if (!topic || topic.trim().length < 5) {
    return NextResponse.json({ error: 'Please provide a topic (at least 5 characters)' }, { status: 400 })
  }

  const selectedModel = (modelId && modelId in MODEL_MAP ? modelId : 'gpt-4o') as ModelId
  const config = MODEL_MAP[selectedModel]

  // Check API key availability
  if (config.provider === 'openai' && !OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
  }
  if (config.provider === 'anthropic' && !ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 500 })
  }
  if (config.provider === 'gemini' && !GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
  }

  try {
    // Step 1: Generate blog content
    let rawContent: string
    if (config.provider === 'openai') {
      rawContent = await callOpenAI(selectedModel, topic)
    } else if (config.provider === 'anthropic') {
      rawContent = await callAnthropic(selectedModel, topic)
    } else {
      rawContent = await callGemini(selectedModel, topic)
    }

    // Parse JSON response (handle markdown code fences)
    let parsed
    try {
      const jsonStr = rawContent.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '').trim()
      parsed = JSON.parse(jsonStr)
    } catch {
      return NextResponse.json({
        error: 'Failed to parse AI response. Please try again.',
        raw: rawContent.substring(0, 500),
      }, { status: 500 })
    }

    // Step 2: Generate cover image with fal.ai → upload to R2
    const coverImageUrl = parsed.image_prompt ? await generateImage(parsed.image_prompt, parsed.slug || 'blog') : ''

    return NextResponse.json({
      title: parsed.title || '',
      slug: parsed.slug || '',
      excerpt: parsed.excerpt || '',
      content: parsed.content || '',
      meta_title: parsed.meta_title || '',
      meta_description: parsed.meta_description || '',
      meta_keywords: parsed.meta_keywords || '',
      cover_image: coverImageUrl,
      image_prompt: parsed.image_prompt || '',
      model_used: `${config.label} (${selectedModel})`,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PUT — regenerate cover image only
export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { image_prompt, slug } = await req.json()
  if (!image_prompt) {
    return NextResponse.json({ error: 'No image prompt provided' }, { status: 400 })
  }

  try {
    const coverImageUrl = await generateImage(image_prompt, slug || 'blog')
    if (!coverImageUrl) {
      return NextResponse.json({ error: 'Image generation failed — check FAL_KEY' }, { status: 500 })
    }
    return NextResponse.json({ cover_image: coverImageUrl })
  } catch {
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
  }
}

// GET — return available models for the frontend dropdown
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session || session.type !== -1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const models = Object.entries(MODEL_MAP).map(([id, config]) => ({
    id,
    label: config.label,
    provider: config.provider,
    available: config.provider === 'openai' ? !!OPENAI_API_KEY
      : config.provider === 'anthropic' ? !!ANTHROPIC_API_KEY
      : !!GEMINI_API_KEY,
  }))

  return NextResponse.json({ models, default: 'gpt-4o' })
}
