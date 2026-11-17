import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn } from 'storybook/test'
import { AuthForm, type AuthMode } from './auth-form'

function Controlled({ initial = 'sign-in' }: { initial?: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initial)
  return (
    <div className="max-w-md">
      <AuthForm mode={mode} onModeChange={setMode} onSuccess={fn()} />
    </div>
  )
}

const meta = {
  title: 'Account/AuthForm',
  component: AuthForm,
  tags: ['autodocs'],
  args: { mode: 'sign-in', onModeChange: fn(), onSuccess: fn() },
  render: () => <Controlled />,
} satisfies Meta<typeof AuthForm>

export default meta
type Story = StoryObj<typeof meta>

/** Sign in: email + password, with the honest "no reset yet" note. */
export const SignIn: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Email')).toHaveAttribute('autocomplete', 'username')
    await expect(canvas.getByLabelText('Password', { selector: 'input' })).toHaveAttribute(
      'autocomplete',
      'current-password',
    )
    await expect(canvas.getByText(/no reset yet/)).toBeVisible()
  },
}

/** Create account adds the Proxy name and the live password rule. */
export const Create: Story = {
  render: () => <Controlled initial="create" />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByLabelText('Proxy name')).toBeVisible()
    const password = canvas.getByLabelText('Password', { selector: 'input' })
    await expect(password).toHaveAttribute('autocomplete', 'new-password')
    await userEvent.type(password, '12345678')
    await expect(password).toHaveAccessibleDescription(/At least 8 characters \(met\)/)
  },
}

/** Validation runs on submit and focuses the first problem. */
export const Validation: Story = {
  render: () => <Controlled initial="create" />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'wise@')
    await userEvent.click(canvas.getByRole('button', { name: /Create account/ }))
    const name = canvas.getByLabelText('Proxy name')
    await expect(name).toHaveFocus()
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(name).toHaveAccessibleDescription(/Enter a Proxy name/)
    await expect(canvas.getByLabelText('Email')).toHaveAccessibleDescription(
      /doesn’t look like an email/,
    )
  },
}

/** No API on this build: submitting explains, nothing breaks. */
export const ServerUnavailable: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'wise@example.com')
    await userEvent.type(canvas.getByLabelText('Password', { selector: 'input' }), 'password1')
    await userEvent.click(canvas.getByRole('button', { name: /Sign in/ }))
    await expect(await canvas.findByRole('alert')).toHaveTextContent(
      /Couldn’t reach the account server/,
    )
  },
}

export const Portuguese: Story = {
  globals: { locale: 'pt-BR' },
  render: () => <Controlled initial="create" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Nome de Proxy')).toBeVisible()
  },
}
