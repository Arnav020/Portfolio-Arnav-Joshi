import { IdeProvider } from '@/ide/IdeProvider'
import { IdeShell } from '@/ide/IdeShell'

export default function Page() {
  return (
    <IdeProvider>
      <IdeShell />
    </IdeProvider>
  )
}
