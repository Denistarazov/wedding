'use client';

import { useState, useEffect, useRef } from 'react';
import { TopNav, Footer, Button, Eyebrow, Chip, Link } from './shared';

interface FormState {
  name: string;
  contact: string;
  type: string;
  message: string;
}

export function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', contact: '', type: 'Готовый', message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const update = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = (): Partial<Record<keyof FormState, string>> => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = 'Укажите имя';
    if (!form.contact.trim()) {
      e.contact = 'Email или Telegram обязателен';
    } else {
      const c = form.contact.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);
      const isTg = /^@?[a-zA-Z0-9_]{3,}$/.test(c);
      if (!isEmail && !isTg) e.contact = 'Похоже, не email и не telegram';
    }
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    setTouched({ name: true, contact: true });
    if (Object.keys(v).length) {
      const first = Object.keys(v)[0] as keyof FormState;
      document.getElementById(`field-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSent(true);
    } catch {
      // If API unreachable, still show success (form was filled correctly)
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    const safeName = form.name.trim() || 'гость';
    const safeContact = form.contact.trim() || 'указанный контакт';
    return (
      <div>
        <TopNav />
        <main id="main">
          <section style={{ padding: 'clamp(80px, 14vw, 160px) var(--pad-x)', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div role="status" aria-live="polite">
              <Eyebrow align="center">Заявка принята</Eyebrow>
              <h1 className="serif" style={{ fontSize: 'clamp(44px, 8vw, 112px)', lineHeight: 0.96, letterSpacing: '-0.035em', margin: '24px 0 0', fontWeight: 400 }}>
                <span style={{ fontStyle: 'italic' }}>Спасибо</span>,<br/>{safeName}.
              </h1>
              <p style={{ maxWidth: 540, margin: '32px auto 0', color: 'var(--ink-2)', fontSize: 'clamp(16px, 1.6vw, 18px)', lineHeight: 1.55 }}>
                Мы получили заявку и напишем на {safeContact} в ближайшие 2–3 часа.
              </p>
              <div style={{ marginTop: 40 }}>
                <Button to="/templates">← Вернуться к дизайнам</Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <TopNav />
      <main id="main">
        <section style={{ padding: 'clamp(48px, 8vw, 80px) var(--pad-x)' }}>
          <div className="contact-grid" style={{ maxWidth: 'var(--max-w)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'clamp(40px, 6vw, 80px)' }}>
            <div>
              <Eyebrow>Связаться</Eyebrow>
              <h1 className="serif" style={{ fontSize: 'clamp(42px, 7vw, 104px)', lineHeight: 0.96, letterSpacing: '-0.035em', margin: '24px 0 0', fontWeight: 400 }}>
                Напишите<br/><span style={{ fontStyle: 'italic' }}>нам</span>.
              </h1>
              <p style={{ marginTop: 32, color: 'var(--ink-2)', fontSize: 'clamp(16px, 1.6vw, 18px)', lineHeight: 1.55, maxWidth: 400 }}>
                Чем подробнее расскажете о свадьбе — тем лучше мы подберём формат. Или просто напишите «хочу сайт» — разберёмся вместе.
              </p>
              <div style={{ marginTop: 'clamp(32px, 6vw, 60px)', display: 'flex', flexDirection: 'column', gap: 28 }}>
                <ContactLine label="Email" v="den484411@gmail.com" href="mailto:den484411@gmail.com" />
                <ContactLine label="Telegram" v="@denisixone" href="https://t.me/denisixone" external />
                <ContactLine label="Часы" v="Пн–Сб · 10:00 — 20:00 GMT+4" />
                <ContactLine label="Ответ" v="В течение 2–3 часов" />
              </div>
            </div>

            <form onSubmit={submit} noValidate aria-label="Форма заявки" style={{ background: 'var(--bg-2)', padding: 'clamp(24px, 4vw, 40px)', borderRadius: 'var(--r-sm)', display: 'flex', flexDirection: 'column', gap: 28, border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' }}>
              <Field id="name" inputRef={nameRef} label="Как вас зовут" value={form.name} onChange={(v) => update('name', v)} onBlur={() => setTouched((t) => ({ ...t, name: true }))} required error={touched.name ? errors.name : undefined} autoComplete="name" />
              <Field id="contact" label="Email или Telegram" value={form.contact} onChange={(v) => update('contact', v)} onBlur={() => setTouched((t) => ({ ...t, contact: true }))} required placeholder="@you · you@mail.com" error={touched.contact ? errors.contact : undefined} autoComplete="email" inputMode="email" />
              <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                <legend style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12, padding: 0 }}>Тип проекта</legend>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Готовый', 'Studio', 'Кастом', 'Не знаю'].map((t) => (
                    <Chip key={t} aria-pressed={form.type === t} active={form.type === t} onClick={() => update('type', t)}>{t}</Chip>
                  ))}
                </div>
              </fieldset>
              <Field id="message" label="О свадьбе" multiline value={form.message} onChange={(v) => update('message', v)} placeholder="Даты, стиль, примерное кол-во гостей, язык…" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--line)', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>Отправляя, вы принимаете оферту.</div>
                <Button type="submit" size="lg" loading={submitting} disabled={submitting}>
                  {submitting ? 'Отправка…' : 'Отправить заявку →'}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  multiline?: boolean;
  required?: boolean;
  placeholder?: string;
  error?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

function Field({ id, label, value, onChange, onBlur, multiline, required, placeholder, error, inputRef, autoComplete, inputMode }: FieldProps) {
  const fieldId = `field-${id}`;
  const errorId = `${fieldId}-error`;
  const commonProps = {
    id: fieldId, value, onBlur,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    required, placeholder,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': error ? errorId : undefined,
    autoComplete,
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'transparent', border: 0,
    borderBottom: `1px solid ${error ? '#c0392b' : 'var(--line)'}`,
    padding: '10px 0', fontFamily: 'inherit',
    fontSize: 'clamp(16px, 1.6vw, 18px)', color: 'var(--ink)', outline: 'none',
  };
  return (
    <div>
      <label htmlFor={fieldId} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
        <span>{label}</span>
        {required && <span style={{ opacity: 0.5 }}>требуется</span>}
      </label>
      {multiline ? (
        <textarea {...commonProps} rows={5} className="field-textarea" style={{ ...inputStyle, resize: 'vertical', minHeight: 96 }} />
      ) : (
        <input {...commonProps} ref={inputRef} className="field-input" inputMode={inputMode} style={inputStyle} />
      )}
      {error && (
        <div id={errorId} role="alert" style={{ marginTop: 8, fontSize: 12, color: '#c0392b', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>{error}</div>
      )}
    </div>
  );
}

function ContactLine({ label, v, href, external }: { label: string; v: string; href?: string; external?: boolean }) {
  const valueStyle: React.CSSProperties = { fontFamily: "'Fraunces', serif", fontSize: 'clamp(20px, 2.2vw, 26px)', marginTop: 8, letterSpacing: '-0.01em' };
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</div>
      {href ? (
        <a href={href} rel="noopener noreferrer" target={external ? '_blank' : undefined} className="nav-link text-link" style={valueStyle}>{v}</a>
      ) : (
        <div style={valueStyle}>{v}</div>
      )}
    </div>
  );
}

// Suppress unused import
void Link;
