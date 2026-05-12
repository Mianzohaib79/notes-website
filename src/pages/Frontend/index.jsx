
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Settings from './Settings'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const Frontend = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="settings" element={<Settings />} />
            </Routes>
            <Footer />

        </>
    )
}

export default Frontend 