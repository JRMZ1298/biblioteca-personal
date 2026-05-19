import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../lib/validations'
import { useAuth } from '../hooks/use-auth'
import { Button, Input } from '../components/ui'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      navigate('/library')
    } catch {
      setError('root', { message: 'Credenciales inválidas. Intenta de nuevo.' })
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="rounded-xl border border-hairline bg-white/90 backdrop-blur-sm p-6 shadow-card">
          <div className="flex justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-ink">
              <rect x="6" y="4" width="28" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <rect x="6" y="4" width="6" height="32" rx="1" fill="currentColor" fillOpacity="0.1" />
              <path d="M14 12h14M14 18h10M14 24h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="font-display text-display-sm text-ink text-center mb-1">
            Biblioteca Personal
          </h1>
          <p className="text-caption text-muted text-center mb-6">
            Inicia sesión para continuar
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            {errors.root && (
              <p className="text-sm text-semantic-error text-center">{errors.root.message}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando…' : 'Iniciar sesión'}
            </Button>
          </form>

          <p className="text-caption text-muted text-center mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-medium text-ink underline underline-offset-2 hover:text-primary transition-colors">
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
