import { computed, ref } from 'vue'
import { BASE_URL_POSTS } from '@/constants'
import type { PostItem, PostsList } from '@/models'
import { useUsers } from './useUsers'

export function usePosts() {
  const { usersList } = useUsers()
  const postsList = ref<PostsList>()
  const post = ref<PostItem>()

  const postsListWithAuthor = computed(() =>
    postsList.value?.map((post) => ({
      ...post,
      author: usersList.value?.find((user) => user.id === post.userId),
    })),
  )

  async function getPosts(): Promise<void> {
    const response = await fetch(BASE_URL_POSTS)

    postsList.value = await response.json()
  }

  async function getSinglePost(id: number) {
    const response = await fetch(`${BASE_URL_POSTS}/${id}`)

    post.value = await response.json()
  }

  async function publishPost(post: {
    title: string
    userId: number
    body: string
  }): Promise<PostItem> {
    const response = await fetch(BASE_URL_POSTS, {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    return await response.json()
  }

  return {
    getPosts,
    getSinglePost,
    post,
    postsList,
    postsListWithAuthor,
    publishPost,
  }
}
