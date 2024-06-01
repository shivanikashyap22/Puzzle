import './NewGame.css'

const NewGame = ({reset}) =>
    <div className='button-wrapper'>
        <button onClick={reset}>Reset</button>
    </div>

export default NewGame