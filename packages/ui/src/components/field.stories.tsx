import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from 'lucide-react'
import { expect } from 'storybook/test'
import { describedBy, Field, Input, PasswordInput } from './field'

const meta = {
  title: 'Design system/Field',
  component: Field,
  tags: ['autodocs'],
  args: { label: 'Email', htmlFor: 'email', children: null },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

/** Label, chamfered input and hint. The focus ring is drawn inside (an outer one is clipped). */
export const Default: Story = {
  render: () => (
    <Field label="Proxy name" htmlFor="name" hint="How the app greets you." hintId="name-hint">
      <Input id="name" aria-describedby="name-hint" autoComplete="nickname" />
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Proxy name')
    await userEvent.click(input)
    await expect(input).toHaveFocus()
    await userEvent.type(input, 'Wise')
    await expect(input).toHaveValue('Wise')
    // The visible ring lives on the wrapper, as an inset shadow.
    await expect(getComputedStyle(input.parentElement!).boxShadow).toContain('inset')
  },
}

/** An error is announced with the field (aria-describedby) and drawn as a red frame. */
export const Invalid: Story = {
  render: () => (
    <Field
      label="Email"
      htmlFor="email-bad"
      error="That doesn’t look like an email. Check for typos."
      errorId="email-bad-error"
    >
      <Input
        id="email-bad"
        type="email"
        defaultValue="wise@"
        invalid
        aria-invalid
        aria-describedby={describedBy('email-bad-error')}
      />
    </Field>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Email')
    await expect(input).toHaveAccessibleDescription(/doesn’t look like an email/)
  },
}

/** Show/hide toggle: the name stays the same, the state is aria-pressed. */
export const Password: Story = {
  render: () => (
    <Field label="Password" htmlFor="password">
      <PasswordInput id="password" showLabel="Show password" autoComplete="current-password" />
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Password', { selector: 'input' })
    await expect(input).toHaveAttribute('type', 'password')
    const toggle = canvas.getByRole('button', { name: 'Show password' })
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await expect(input).toHaveAttribute('type', 'text')
  },
}

/** Search box with a hidden label and a leading icon. */
export const SearchBox: Story = {
  render: () => (
    <Field label="Search Agents" htmlFor="q" labelHidden>
      <Input
        id="q"
        type="search"
        placeholder="Search Agents"
        start={<Search className="size-4 shrink-0 text-muted" aria-hidden />}
      />
    </Field>
  ),
}
