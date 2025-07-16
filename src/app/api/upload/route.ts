// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { storage } from '@/lib/firebase'

// Disable edge runtime if using Firebase Storage
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${uuidv4()}_${file.name}`
    const fileRef = ref(storage, `uploads/${fileName}`)

    // Upload to Firebase Storage
    await uploadBytes(fileRef, fileBuffer, {
      contentType: file.type,
    })

    const downloadURL = await getDownloadURL(fileRef)

    return NextResponse.json({ success: true, url: downloadURL })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Upload failed:', message)

    return NextResponse.json(
      { error: 'Upload failed', details: message },
      { status: 500 }
    )
  }
}
