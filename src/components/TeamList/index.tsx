import { useEffect, useState } from 'react'
import { IGithubUser } from './github-user.interface'
import {
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
} from 'react-bootstrap'
import './TeamList.css'

const TeamList: React.FC = () => {
  const [users, setUsers] = useState<IGithubUser[]>([])

  useEffect(() => {
    const usernames = ['rainanDeveloper', 'cristianrlf']

    Promise.all(
      usernames.map(async (username) => {
        const result = await fetch(`https://api.github.com/users/${username}`)

        if (result.status === 200) {
          return await result.json()
        }

        throw new Error(await result.json())
      }),
    ).then((data) => {
      setUsers(data)
    })
  }, [])

  return (
    <>
      <div className="team-members d-flex gap-3 flex-wrap">
        {users.map((user, idx) => (
          <Card key={idx}>
            <CardBody>
              <a href={user.html_url} target="_blank" rel="noreferrer">
                <img
                  className="user-github-profile-picture"
                  src={user.avatar_url}
                  alt=""
                />
              </a>
              <CardTitle>
                <h3>{user.name}</h3>
              </CardTitle>
              <CardSubtitle>
                <a href={user.html_url} target="_blank" rel="noreferrer">
                  @{user.login}
                </a>
              </CardSubtitle>
              <CardText>{user.bio}</CardText>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  )
}

export default TeamList
