import Image from "next/image";
import { GithubUserData } from "../fetchGithubUserData";

type UserCardProps = React.HTMLAttributes<HTMLDivElement> & {
  user?: GithubUserData
}

export default function UserCard({ user }: UserCardProps) {
  return <div className="flex flex-col items-start justify-start p-4 rounded-2xl gap-2 bg-zinc-800 grow">
    <a className="" href={user?.html_url} target="_blank" rel="noopener noreferrer">
      <Image className="rounded-full" width={100} height={100} src={user?.avatar_url ?? 'https://placehold.co/100'} alt={`Github user avatar of ${user?.name}`} />
    </a>
    <h1 className="text-lg font-bold">{user?.name}</h1>
    <a href={user?.html_url} target="_blank" rel="noopener noreferrer" className="text-base font-bold">@{user?.login}</a>
    <p>{user?.bio}</p>
  </div>
}
