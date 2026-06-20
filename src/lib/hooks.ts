import { useEffect, useState } from 'react'
import type { GeoFeature, GeoMode, MeasureData, Meta, Places } from './types'
import { loadGeometry, loadMeasure, loadMeta, loadPlaces } from './data'

export function useMeta(): Meta | null {
  const [meta, setMeta] = useState<Meta | null>(null)
  useEffect(() => {
    let live = true
    loadMeta().then((m) => live && setMeta(m))
    return () => {
      live = false
    }
  }, [])
  return meta
}

export function usePlaces(): Places | null {
  const [places, setPlaces] = useState<Places | null>(null)
  useEffect(() => {
    let live = true
    loadPlaces().then((p) => live && setPlaces(p))
    return () => {
      live = false
    }
  }, [])
  return places
}

export function useGeometry(mode: GeoMode): GeoFeature[] {
  const [features, setFeatures] = useState<GeoFeature[]>([])
  useEffect(() => {
    let live = true
    loadGeometry(mode).then((f) => live && setFeatures(f))
    return () => {
      live = false
    }
  }, [mode])
  return features
}

export function useMeasureData(measureId: string): MeasureData | null {
  const [data, setData] = useState<MeasureData | null>(null)
  useEffect(() => {
    let live = true
    setData(null)
    loadMeasure(measureId).then((d) => live && setData(d))
    return () => {
      live = false
    }
  }, [measureId])
  return data
}
