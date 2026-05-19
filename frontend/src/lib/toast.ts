import { sileo } from 'sileo'

export function toastSuccess(title: string, description?: string) {
  sileo.success({ title, description })
}

export function toastError(title: string, description?: string) {
  sileo.error({ title, description })
}

export function toastInfo(title: string, description?: string) {
  sileo.info({ title, description })
}
