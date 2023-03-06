import { A } from '@solidjs/router';
import { createEffect, createSignal, For } from 'solid-js';
import logo from '../../assets/logo.svg';
import { IconChevronRight } from '../../components/Icon.ChevronRight';
import { Container, Title, Form, ListRepositories, Error } from './styles';

interface IRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard = () => {
  const [owner, setOwner] = createSignal('');
  const [fetchOwner, setFetchOwner] = createSignal<'users' | 'orgs'>('users');
  const [inputError, setInputError] = createSignal('');
  const [repositories, setRepositories] = createSignal<IRepository[]>(getReposFromLocalStorage());

  function getReposFromLocalStorage() {
    const storagedRepositories = localStorage.getItem('@githubExplorer:repositories');
    if (storagedRepositories)
      return JSON.parse(storagedRepositories);
    else
      return [];
  }

  async function handleAddRepository(e: any) {
    e.preventDefault();
    if (!owner()) {
      setInputError('Type the author/name of the Repository.');
      return;
    }
    setInputError('');

    await fetch(`https://api.github.com/${fetchOwner()}/${owner()}/repos`)
      .then(async resp => {
        const data = await resp.json();
        setRepositories([...data]);
        setOwner('');
      })
      .catch(_ => setInputError('Error searching this repo. Please verify the author/name typed.'));


  }

  createEffect(() => {
    localStorage.setItem('@githubExplorer:repositories', JSON.stringify(repositories()));
  });

  return (
    <Container>
      <div class="header">
        <img src={logo} alt="Logo" />
        <div class='subtitles'>
          <span onclick={() => setFetchOwner('users')} class={fetchOwner() === 'users' ? 'is-selected' : ''}>User</span>
          <span onclick={() => setFetchOwner('orgs')} class={fetchOwner() === 'orgs' ? 'is-selected' : ''}>Organization</span>
        </div>
      </div>
      <Title>Exploit repositories of a {fetchOwner() === 'users' ? 'user' : 'organization'} on github</Title>
      <Form hasError={inputError().length > 0} onSubmit={handleAddRepository}>
        <input
          type="text"
          name="newRepository"
          value={owner()}
          onChange={e => { setOwner(e.currentTarget.value) }}
          placeholder={`Type the name of the ${fetchOwner() === 'users' ? 'user' : 'organization'}`}
        />
        <button
          type="submit"
        >
          Search
        </button>
      </Form>
      {inputError() && <Error>{inputError()}</Error>}
      <ListRepositories>
        <For each={repositories()}>
          {(repository) => <A href={`/repository/${repository.owner.login}/${repository.name}`}>
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <IconChevronRight />
          </A>}
        </For>
      </ListRepositories>
    </Container>
  );
}

export default Dashboard;