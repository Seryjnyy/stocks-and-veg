import DataError from '@/components/data-error'
import GroupTasks from '@/components/group/group-tasks'
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { CONFIG } from '@/lib/config'
import { useCreateInviteLink } from '@/lib/hooks/mutations/use-create-invite-link'
import { useGetGroup } from '@/lib/hooks/queries/use-get-group'
import {
  GroupUserWithProfile,
  useGetGroupUsers,
} from '@/lib/hooks/queries/use-get-group-users'
import { useGetInviteLink } from '@/lib/hooks/queries/use-get-invite-link'
import { useAuth } from '@/lib/hooks/use-auth'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { formatInviteLink } from '@/lib/utils'
import SpinnerButton from '@/spinner-button'
import { CopyIcon } from '@radix-ui/react-icons'

import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

export const Route = createFileRoute('/groups/$groupID')({
  component: Group,
})

const GroupUser = ({ user }: { user: GroupUserWithProfile }) => {
  const { session } = useAuth()

  const isUs = session?.user.id == user.user_id

  return (
    <div className="w-full p-4 border rounded-sm flex flex-col">
      <span>{user.profile?.username}</span>
      <span>{user.profile?.user_id}</span>
      <span>{isUs ? 'Us' : 'Not us'}</span>
    </div>
  )
}

const GroupUsersList = ({ users }: { users: GroupUserWithProfile[] }) => {
  return users.map((user) => <GroupUser user={user} key={user.id} />)
}

const GroupUsers = ({ groupID }: { groupID: string }) => {
  const { data, error } = useGetGroupUsers({
    groupID: groupID,
  })

  if (error) {
    return <div>error</div>
  }

  return (
    <div className="border p-4">
      <h3>Group users</h3>
      <ul>
        <GroupUsersList users={data || []} />
      </ul>
      <span>
        {(data || []).length}/{CONFIG.maxGroupUsers}
      </span>
    </div>
  )
}

// TODO : error unhandled
const Invite = ({ groupID }: { groupID: string }) => {
  const { data, isError, isLoading } = useGetInviteLink({ groupID: groupID })
  const { mutateAsync: createInviteLink, isPending } = useCreateInviteLink()
  const { toast } = useToast()
  const [copiedText, copy] = useCopyToClipboard()

  const handleCopy = (text: string) => {
    copy(text)
      .then(() => {
        toast({
          title: 'Successfully copied invite link.',
        })
      })
      .catch((error) => {
        toast({
          title: 'Failed to copy invite link.',
          variant: 'destructive',
        })
      })
  }

  const handleGenerateLink = () => {
    createInviteLink(
      [
        {
          id: data?.id ?? undefined,
          group_id: groupID,
          token: '',
          expires_at: new Date().toISOString(),
        },
      ],
      {
        onSuccess: () => {
          toast({
            title: 'Successfully generated invite link.',
            description: 'Invite link was copied to your clipboard.',
          })
        },
        onError: () => {
          toast({
            title: 'Failed to generate invite link.',
            variant: 'destructive',
          })
        },
      },
    )
  }

  const isInviteLinkExpired = data
    ? new Date() > new Date(data.expires_at)
    : false

  return (
    <div className="p-4 border">
      <h3 className="text-xl">Invite</h3>

      <div className="border p-2">
        <p className="text-sm text-muted-foreground pb-4">
          Get a invite link and share it with your friend. They can visit the
          link to join this group. Invite links are valid for a day.
        </p>
        <div className="border p-2">
          <code>{data && formatInviteLink(data?.token)}</code>
        </div>
        <div>
          <div className="flex items-center gap-4">
            <SpinnerButton
              onClick={handleGenerateLink}
              isPending={isPending || isLoading}
              disabled={isLoading}
            >
              Generate new invite link
            </SpinnerButton>

            <Button
              size={'icon'}
              disabled={data == null || isInviteLinkExpired || isLoading}
              onClick={() => {
                if (data) {
                  handleCopy(formatInviteLink(data?.token))
                }
              }}
            >
              <CopyIcon />
            </Button>
          </div>
          {isInviteLinkExpired && (
            <div className="text-xs text-muted-foreground">
              Old invite link has expired. Please generate a new one.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// TODO : is it better to drill stuff like session, or let components use useAuth hook?
function Group() {
  const { groupID } = Route.useParams()
  const { session } = useAuth()
  const { data, error, isLoading } = useGetGroup({
    enabled: !!session,
    groupID: groupID,
  })

  if (error) {
    return <DataError message={error.message} />
  }

  if (isLoading) {
    return <Loading />
  }

  if (data == null) {
    return <DataError message="Group data is missing." />
  }

  return (
    <div className="p-12 space-y-8">
      <h1 className="font-bold text-3xl">{data.name}</h1>

      {session?.user.id == data?.creator_id ? 'we created' : 'we not created'}

      <GroupUsers groupID={groupID} />
      <GroupTasks groupID={groupID} />
      <Invite groupID={groupID} />
    </div>
  )
}
