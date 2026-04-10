export interface WindowState {
  id: string
  title: string
  icon: string
  color: string
  zIndex: number
  minimised: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
}
