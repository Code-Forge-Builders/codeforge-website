import { fetchGithubUserData } from "./fetchGithubUserData";
import { getTranslations } from "next-intl/server";
import UserCard from "./UserCard";

export default async function OurTeam() {
  const t = await getTranslations();

  const githubUserNames = ['rainanDeveloper', 'cristianrlf'];

  const githubUsersData = await Promise.all(githubUserNames.map(username => fetchGithubUserData(username)));

  const timestamp = Date.now();

  console.log(timestamp);

  return <section id="our-team" className="bg-zinc-900 w-screen flex justify-center">
    <section className="flex flex-col w-7/12 gap-4 pb-8">
      <div id="our-services-header" className="flex flex-col p-8 mt-[63px] gap-4">
        <h2 className="text-center text-4xl md:text-6xl font-semibold">{t('OurTeam.title')}</h2>
      </div>
      <div className="flex flex-row gap-4">
        {
          githubUsersData.map((userData, id) => <UserCard key={id} user={userData} />)
        }
      </div>
    </section>
  </section>
}
