import { supabase, isSupabaseDemoMode } from '../../lib/supabase'

export interface Video {
  id: string
  title: string
  description?: string
  url: string
  thumbnail_url?: string
  duration?: number
  category?: string
  plan_required?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface VideoProgress {
  id: string
  user_id: string
  video_id: string
  watched_duration: number
  completed: boolean
  last_watched_at: string
}

export interface CreateVideoInput {
  title: string
  description?: string
  url: string
  thumbnail_url?: string
  duration?: number
  category?: string
  plan_required?: string
  tags?: string[]
}

export const getVideos = async (userPlan?: string): Promise<Video[]> => {
  if (isSupabaseDemoMode) {
    console.log("🔧 Demo mode: getVideos")
    return [
      {
        id: "1",
        title: "Treino de Força Básico",
        description: "Introdução ao treino de força para iniciantes",
        url: "https://example.com/video1",
        thumbnail_url: "https://example.com/thumb1.jpg",
        duration: 1800,
        category: "Força",
        plan_required: "A",
        tags: ["iniciante", "força", "musculação"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  }

  let query = supabase.from('videos').select('*')

  // Filter by plan if user has one
  if (userPlan) {
    query = query.or(`plan_required.is.null,plan_required.eq.${userPlan}`)
  } else {
    // If no plan, only show videos without plan requirement
    query = query.is('plan_required', null)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching videos:', error)
    throw new Error('Erro ao buscar vídeos')
  }

  return data || []
}

export const getVideoById = async (videoId: string): Promise<Video | null> => {
  if (isSupabaseDemoMode) {
    console.log("🔧 Demo mode: getVideoById", videoId)
    return {
      id: videoId,
      title: "Vídeo Demo",
      url: "https://example.com/video",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', videoId)
    .single()

  if (error) {
    console.error('Error fetching video:', error)
    return null
  }

  return data
}

export const createVideo = async (videoData: CreateVideoInput): Promise<Video> => {
  if (isSupabaseDemoMode) {
    console.log("🔧 Demo mode: createVideo", videoData)
    return {
      id: `demo-${Date.now()}`,
      ...videoData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  const { data, error } = await supabase
    .from('videos')
    .insert([videoData])
    .select()
    .single()

  if (error) {
    console.error('Error creating video:', error)
    throw new Error('Erro ao criar vídeo')
  }

  return data
}

export const updateVideo = async (videoId: string, updates: Partial<CreateVideoInput>): Promise<Video> => {
  if (isSupabaseDemoMode) {
    console.log("🔧 Demo mode: updateVideo", videoId, updates)
    return {
      id: videoId,
      title: "Vídeo Atualizado",
      url: "https://example.com/video",
      ...updates,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  const { data, error } = await supabase
    .from('videos')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', videoId)
    .select()
    .single()

  if (error) {
    console.error('Error updating video:', error)
    throw new Error('Erro ao atualizar vídeo')
  }

  return data
}

export const deleteVideo = async (videoId: string): Promise<void> => {
  if (isSupabaseDemoMode) {
    console.log("🔧 Demo mode: deleteVideo", videoId)
    return
  }

  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', videoId)

  if (error) {
    console.error('Error deleting video:', error)
    throw new Error('Erro ao deletar vídeo')
  }
}

export const getUserVideoProgress = async (userId: string, videoId: string): Promise<VideoProgress | null> => {
  if (isSupabaseDemoMode) {
    console.log("🔧 Demo mode: getUserVideoProgress", userId, videoId)
    return {
      id: "demo-progress",
      user_id: userId,
      video_id: videoId,
      watched_duration: 300,
      completed: false,
      last_watched_at: new Date().toISOString(),
    }
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error fetching video progress:', error)
    return null
  }

  return data
}

export const updateVideoProgress = async (
  userId: string,
  videoId: string,
  watchedDuration: number,
  completed: boolean = false
): Promise<void> => {
  if (isSupabaseDemoMode) {
    console.log("🔧 Demo mode: updateVideoProgress", userId, videoId, watchedDuration, completed)
    return
  }

  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      video_id: videoId,
      watched_duration: watchedDuration,
      completed,
      last_watched_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error updating video progress:', error)
    throw new Error('Erro ao atualizar progresso do vídeo')
  }
}

export const getUserFavorites = async (userId: string): Promise<Video[]> => {
  if (isSupabaseDemoMode) {
    console.log("🔧 Demo mode: getUserFavorites", userId)
    return []
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select(`
      video_id,
      videos (*)
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user favorites:', error)
    throw new Error('Erro ao buscar favoritos')
  }

  return data?.map(item => item.videos).filter(Boolean) || []
}

export const toggleVideoFavorite = async (userId: string, videoId: string): Promise<boolean> => {
  if (isSupabaseDemoMode) {
    console.log("🔧 Demo mode: toggleVideoFavorite", userId, videoId)
    return true
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .single()

  if (existing) {
    // Remove from favorites
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('video_id', videoId)

    if (error) {
      console.error('Error removing from favorites:', error)
      throw new Error('Erro ao remover dos favoritos')
    }
    return false
  } else {
    // Add to favorites
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        video_id: videoId,
      })

    if (error) {
      console.error('Error adding to favorites:', error)
      throw new Error('Erro ao adicionar aos favoritos')
    }
    return true
  }
}
