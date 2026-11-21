import { FormEvent, useEffect, useId, useState } from 'react'

const assetPath = `${import.meta.env.BASE_URL}assets`

type TextFieldProps = {
  label: string
  placeholder: string
  type?: 'text' | 'password'
  value: string
  error?: string
  onChange: (value: string) => void
}

function TextField({ label, placeholder, type = 'text', value, error, onChange }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="text-field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className={`input-shell${value ? ' is-filled' : ''}`}>
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          autoComplete={type === 'password' ? 'current-password' : 'username'}
          id={id}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
          value={value}
        />
        {value && (
          <button className="clear-button" onClick={() => onChange('')} type="button" aria-label={`${label} 지우기`}>
            <img src={`${assetPath}/1b555.svg`} alt="" />
          </button>
        )}
      </div>
      {error && (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      )}
    </div>
  )
}

function ActionButton({ disabled }: { disabled: boolean }) {
  return (
    <button className="action-button" disabled={disabled} type="submit">
      로그인
    </button>
  )
}

const providers = [
  { name: '네이버', asset: '7d24c.svg' },
  { name: '카카오', asset: '1aa30.svg', recent: true },
  { name: 'Apple', asset: '44aa2.svg' },
  { name: 'Google', asset: '83e45.svg', google: true },
]

function SocialLogins() {
  const notify = (provider: string) => window.alert(`${provider} 로그인은 사용자 테스트용 화면입니다.`)

  return (
    <div className="social-logins" aria-label="간편 로그인">
      {providers.map((provider) => (
        <div className="social-item" key={provider.name}>
          {provider.recent && <span className="recent-badge">최근로그인</span>}
          <button
            className={`social-button${provider.google ? ' google' : ''}`}
            onClick={() => notify(provider.name)}
            type="button"
            aria-label={`${provider.name}로 로그인`}
          >
            <img src={`${assetPath}/${provider.asset}`} alt="" />
          </button>
        </div>
      ))}
    </div>
  )
}

function LoadingModal() {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="loading-title">
      <div className="loading-modal">
        <div className="modal-copy">
          <strong id="loading-title">로그인 처리 중입니다</strong>
          <span>잠시만 기다려 주세요.</span>
        </div>
        <div className="spinner" aria-hidden="true">
          <img className="spinner-track" src={`${assetPath}/ed82c.svg`} alt="" />
          <img className="spinner-active" src={`${assetPath}/86ce2.svg`} alt="" />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const idFormatError = Boolean(userId) && !/^[a-zA-Z]+$/.test(userId)
  const idError = idFormatError
    ? '아이디는 영문으로만 입력 가능합니다'
    : submitted && !userId
      ? '아이디를 다시 입력해주세요'
      : undefined
  const passwordError = submitted && !password ? '비밀번호를 다시 입력해주세요' : undefined
  const ready = Boolean(userId && password && !idFormatError)

  useEffect(() => {
    if (!loading) return
    const timer = window.setTimeout(() => setLoading(false), 1800)
    return () => window.clearTimeout(timer)
  }, [loading])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (ready) setLoading(true)
  }

  const notify = (label: string) => window.alert(`${label} 기능은 사용자 테스트용 화면입니다.`)

  return (
    <main className="login-page">
      <header className="brand-header">
        <p className="brand">HALLYM UNI</p>
        <h1>지금 로그인</h1>
      </header>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="아이디"
          placeholder="아이디를 입력하세요"
          value={userId}
          error={idError}
          onChange={(value) => {
            setUserId(value)
            setSubmitted(false)
          }}
        />
        <TextField
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          type="password"
          value={password}
          error={passwordError}
          onChange={(value) => {
            setPassword(value)
            setSubmitted(false)
          }}
        />

        <button className="password-link" onClick={() => notify('비밀번호 찾기')} type="button">
          비밀번호 찾기
        </button>

        <ActionButton disabled={!submitted && (!userId || idFormatError)} />
      </form>

      <nav className="account-links" aria-label="계정 메뉴">
        <button onClick={() => notify('회원가입')} type="button">
          회원가입
        </button>
        <span aria-hidden="true">|</span>
        <button onClick={() => notify('아이디 찾기')} type="button">
          아이디 찾기
        </button>
      </nav>

      <SocialLogins />
      {loading && <LoadingModal />}
    </main>
  )
}
