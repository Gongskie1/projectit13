import { Route, Routes } from "react-router-dom"
import { EditProfilePage, EditUserPost, HomePage, Login, RegisterPage } from "./pages"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="homepage" element={<HomePage />}/>
        <Route path="register" element={<RegisterPage />} />
        <Route path="editprofile" element={<EditProfilePage />} />
        <Route path="dashboard" element={<EditProfilePage />} />
        <Route path="/edit/:id" element={<EditUserPost />} />

      </Routes>
    </>
  )
}

export default App
