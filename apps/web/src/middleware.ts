import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options: _options }) => {
            req.cookies.set(name, value)
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 認証状態を確認
  const { data: { session } } = await supabase.auth.getSession()

  // 管理者ルートの保護
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // ログインページは除外
    if (req.nextUrl.pathname === '/admin/login') {
      // 既にログインしている場合は管理者画面にリダイレクト
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (profile?.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', req.url))
        }
      }
      return res
    }

    // 未ログインの場合はログインページにリダイレクト
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // ユーザーのroleを確認
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (error || profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}