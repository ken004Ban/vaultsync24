import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseReady } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(
  _req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    if (!isSupabaseReady || !supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Cloud storage not configured',
          details: 'Share links require Supabase to be set up. See SETUP.md for instructions.',
          setupNeeded: true,
        },
        { status: 503 }
      )
    }

    const { fileId } = params

    const { data: row, error } = await supabaseAdmin
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (error || !row) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    if (row.expires_at < Date.now()) {
      return NextResponse.json(
        { error: 'This file has expired', expired: true },
        { status: 410 }
      )
    }

    const { data: signedUrlData } = await supabaseAdmin.storage
      .from('uploads')
      .createSignedUrl(row.storage_path, 60 * 60 * 24)

    return NextResponse.json({
      success: true,
      id: row.id,
      name: row.name,
      size: row.size,
      type: row.type,
      storagePath: row.storage_path,
      url: signedUrlData?.signedUrl || row.url,
      uploadedAt: row.uploaded_at,
      expiresAt: row.expires_at,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('File lookup failed:', message)
    return NextResponse.json(
      { error: 'Failed to load file', details: message },
      { status: 500 }
    )
  }
}
