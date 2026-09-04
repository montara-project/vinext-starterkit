import { IconLoader2, IconPlus, IconTrash } from '@tabler/icons-react'
import { VariantProps } from 'class-variance-authority'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>

interface ButtonRemoveProps extends ButtonProps {
  onClick: () => void
  loading?: boolean
  withIcon?: boolean
  withText?: boolean
}

export function ButtonRemove({
  onClick,
  loading,
  disabled,
  withIcon = true,
  withText = true,
  className,
  ...props
}: ButtonRemoveProps) {
  const renderIcon = () => {
    if (withIcon) {
      return loading ? (
        <IconLoader2 className="animate-spin" />
      ) : (
        <IconTrash className="size-4 text-red-500 dark:text-red-400" />
      )
    }
    return null
  }

  const renderText = () => {
    if (withText) {
      return loading ? <span>Removing...</span> : <span>Remove</span>
    }
    return null
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        'border-red-300 bg-red-50 text-red-500 hover:border-red-400 hover:bg-red-100 hover:text-red-600',
        'dark:border-red-800 dark:bg-red-950 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-900 dark:hover:text-red-300',
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {renderIcon()}
      {renderText()}
    </Button>
  )
}

interface ButtonAddProps extends ButtonProps {
  label: string
  onClick: () => void
}

export function ButtonAdd({ label, onClick, ...props }: ButtonAddProps) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} {...props}>
      <IconPlus className="size-4" />
      <span>{label}</span>
    </Button>
  )
}
