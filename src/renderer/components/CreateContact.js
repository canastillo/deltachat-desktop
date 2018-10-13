const React = require('react')
const { ipcRenderer } = require('electron')

const {
  Alignment,
  Classes,
  InputGroup,
  FormGroup,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Button
} = require('@blueprintjs/core')

class CreateContact extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      name: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.back = this.back.bind(this)
  }

  back () {
    this.props.changeScreen('ChatList')
  }

  shouldComponentUpdate (nextProps, nextState) {
    // we don't care about the props for now, really.
    return (this.state !== nextState)
  }

  handleChange (event) {
    var state = {}
    state[event.target.id] = event.target.value
    delete state.error
    this.setState(state)
  }

  handleSubmit (event) {
    var self = this
    const tx = window.translate
    event.preventDefault()
    const { name, email } = this.state

    function createContact () {
      var id = ipcRenderer.sendSync('dispatchSync', 'createContact', name, email)
      self.props.screenProps.onSubmit(id)
    }

    // TODO: better frontend email validation

    if (name.length && email.length) {
      createContact(name, email)
    } else if (email.length) {
      createContact(email.split('@')[0], email)
    } else {
      return this.props.userFeedback({ type: 'error', text: tx('emailValidationFailed') })
    }
  }

  render () {
    const tx = window.translate
    return (
      <div>
        <Navbar fixedToTop>
          <NavbarGroup align={Alignment.LEFT}>
            <Button className={Classes.MINIMAL} icon='undo' onClick={this.back} />
            <NavbarHeading>Create Contact</NavbarHeading>
          </NavbarGroup>
        </Navbar>
        <div className='window'>
          <form onSubmit={this.handleSubmit}>
            <FormGroup label='E-Mail Address' placeholder='E-Mail Address' labelFor='email' labelInfo='(required)'>
              <InputGroup
                id='email'
                type='text'
                value={this.state.email}
                leftIcon='envelope'
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup label='Name' placeholder='Name' labelFor='name'>
              <InputGroup
                id='name'
                leftIcon='person'
                type='text'
                value={this.state.name}
                onChange={this.handleChange}
              />
            </FormGroup>
            <Button type='submit' text={tx('addContact')} />
          </form>
        </div>
      </div>
    )
  }
}

module.exports = CreateContact
