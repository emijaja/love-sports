'use server'

import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function adminLogin(email: string, password: string) {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Componentでsetできない場合があるため
        }
      },
    },
  })
  
  try {
    // ログイン試行
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      return {
        error: 'メールアドレスまたはパスワードが正しくありません'
      }
    }

    if (!authData.user) {
      return {
        error: 'ログインに失敗しました'
      }
    }

    // ユーザーのプロフィールを取得してroleをチェック
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      await supabase.auth.signOut()
      return {
        error: 'プロフィール情報の取得に失敗しました'
      }
    }

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      return {
        error: '管理者権限がありません'
      }
    }
  } catch (error) {
    console.error('Admin login error:', error)
    return {
      error: 'ログイン処理中にエラーが発生しました'
    }
  }

  // 成功時はリダイレクト
  // revalidatePath('/admin')
  redirect('/admin')
}