import type { Project } from '@/types'
import { SynthSalesPipelineDiagram } from './SynthSalesPipelineDiagram'
import { FailureInjectionWorkerPoolDiagram } from './FailureInjectionWorkerPoolDiagram'

type DiagramKey = NonNullable<Project['diagram']>

export const diagramRegistry: Partial<Record<DiagramKey, React.ComponentType>> = {
  'synthsales-pipeline': SynthSalesPipelineDiagram,
  'failure-injection-pool': FailureInjectionWorkerPoolDiagram,
}
