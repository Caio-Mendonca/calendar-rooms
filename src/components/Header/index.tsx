import { Hamburguer } from '@/components/Hamburguer'
import { CreateEventButton } from './CreateEventButton'
import HeaderDate from './Date'
import { SearchForm } from './SearchForm'
import { useRouter } from 'next/router'
import { ProfileButton } from './ProfileButton'

export const Header = () => {
  const router = useRouter()
  const path = router.pathname
  return (
    <header className="flex w-full flex-row border-b border-slate-300 p-10">
      <nav className="flex w-full flex-wrap items-center justify-center gap-5 xl:justify-between">
        <div className="flex gap-4">
          <Hamburguer />
          <h4>Sala: {path === '/' ? 'Deolinda': 'José Mauricio'}  </h4>
        </div>
        <HeaderDate />
        <div className="flex flex-wrap items-center justify-center gap-2 xl:justify-end">
          <SearchForm />
          <CreateEventButton />
          <ProfileButton />
        </div>
      </nav>
    </header>
  )
}
