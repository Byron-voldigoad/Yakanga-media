
'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export async function subscribeToNewsletter(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  if (!email || !email.includes('@')) {
    return { error: 'Veuillez entrer une adresse email valide.' }
  }

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Cette adresse email est déjà inscrite.' }
    }
    console.error('Erreur subscribeToNewsletter:', error)
    return { error: 'Une erreur est survenue lors de l\'inscription.' }
  }

  return { success: true }
}
