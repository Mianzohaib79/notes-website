import AuthContext from './Auth'
import { NoteProvider } from './NoteContext'

const AppProvider = ({ children }) => {
    return (
        <AuthContext>
            <NoteProvider>
                {children}
            </NoteProvider>
        </AuthContext>
    )
}

export default AppProvider