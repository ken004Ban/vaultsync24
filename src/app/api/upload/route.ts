import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { supabaseAdmin, isSupabaseReady } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseReady || !supabaseAdmin) {
      return NextResponse.json(
        { error: 'Storage not configured. Set Supabase env vars.' },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const fileId = uuidv4()
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const storagePath = `${fileId}_${file.name}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('uploads')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`)
    }

    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from('uploads')
      .createSignedUrl(storagePath, 60 * 60 * 24)

    if (signedUrlError || !signedUrlData) {
      throw new Error(`Signed URL generation failed: ${signedUrlError?.message}`)
    }

    const now = Date.now()
    const metadata = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      storagePath,
      url: signedUrlData.signedUrl,
      uploadedAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000,
    }

    const { error: dbError } = await supabaseAdmin
      .from('files')
      .insert({
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        storage_path: storagePath,
        url: signedUrlData.signedUrl,
        uploaded_at: now,
        expires_at: now + 24 * 60 * 60 * 1000,
      })

    if (dbError) {
      throw new Error(`DB insert failed: ${dbError.message}`)
    }

    return NextResponse.json({ success: true, ...metadata })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Upload failed:', message)
    return NextResponse.json(
      { error: 'Upload failed', details: message },
      { status: 500 }
    )
  }
}
