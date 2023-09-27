import NavButtons from './NavButtons'

const Nav = () => {
  return (
    <nav className="mt-5 flex w-full flex-col items-start justify-between overflow-y-scroll scrollbar xl:h-full">
      <div className="w-full flex-col justify-center lg:flex">
        <NavButtons />
      </div>
    </nav>
  )
}

export default Nav
