import { A, useParams } from '@solidjs/router';
import { createSignal, For } from 'solid-js';
import logo from '../../assets/logo.svg';
import { IconChevronLeft } from '../../components/Icon.ChevronLeft';
import { IconChevronRight } from '../../components/Icon.ChevronRight';
import { Container, Header, RepositoryInfo, IssuesList } from './styles';

interface IRepository {
  id: number;
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  },
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

interface IIssue {
  id: number;
  title: string;
  user: {
    login: string;
  }
  html_url: string;

}

const Repository = () => {
  const params = useParams();
  const [repository, setRepository] = createSignal<IRepository | undefined>(undefined);
  const [issues, setIssues] = createSignal<IIssue[]>([]);

  fetch(`https://api.github.com/repos/${params.owner}/${params.repository}`).then(async resp => {
    const data = await resp.json();
    setRepository(data);
  });

  fetch(`https://api.github.com/repos/${params.owner}/${params.repository}/issues`).then(async resp => {
    const data = await resp.json();
    setIssues(data);
  });

  return (
    <Container>
      <Header>
        <img src={logo} alt="GitHub Explorer" />
        <A href="/">
          <IconChevronLeft />
          Back To Dashboard
        </A>
      </Header>
      {repository() !== undefined ? (
        <RepositoryInfo>
          <header>
            <img src={repository()?.owner.avatar_url} alt={repository()?.owner.login} />
            <div>
              <strong>{repository()?.full_name}</strong>
              <p>{repository()?.description}</p>
            </div>
          </header>

          <ul>
            <li>
              <strong>{repository()?.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository()?.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository()?.open_issues_count}</strong>
              <span>Issues</span>
            </li>
          </ul>
        </RepositoryInfo>
      ) :
        <h2 style={{ "margin-top": '80px' }}>Loading ...</h2>
      }
      {issues() && (
        <IssuesList>
          <For each={issues()}>
            {issue => <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
              <div>
                <strong>{issue.title}</strong>
                <p>{issue.user.login}</p>
              </div>
              <IconChevronRight />
            </a>}
          </For>
        </IssuesList>
      )}
    </Container>
  );
}

export default Repository;