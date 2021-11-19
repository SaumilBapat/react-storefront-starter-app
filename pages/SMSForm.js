import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles'

const buttonStyle = {
    color: 'white',
    backgroundColor: '#556cd6',
    fontsize: '0.875rem',
    FontFaceSet: '"Roboto", "Helvetica", "Arial", sans-serif'
  };

const divStyle = {
    fontWeight: '300',
    fontSize: '2em',
    fontsize: '0.875rem',
    FontFaceSet: '"Roboto", "Helvetica", "Arial", sans-serif'
  };

const styles = theme => ({
    root: {
      paddingBottom: '64px',
    },
    checkoutPanel: {
      backgroundColor: theme.palette.grey['200'],
      borderRadius: theme.shape.borderRadius,
      padding: `${theme.spacing(2)}px`,
    },
    total: {
      fontWeight: 'bold',
    },
    checkoutButton: {
      width: '100%',
    },
    docked: {
      [theme.breakpoints.down('xs')]: {
        fontSize: theme.typography.subtitle1.fontSize,
        padding: `${theme.spacing(2)}px`,
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        zIndex: 10,
        borderRadius: '0',
        boxShadow: 'none',
      },
    },
  })
  
  const useStyles = makeStyles(styles)

class SMSForm extends Component {

    // Form Constructor
    constructor(props) {
        super(props);
        this.state = {
          message: {
            to: '',
            body: ''
          },
          submitting: false,
          error: false
        };
        this.onHandleChange = this.onHandleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
      }
    
    // Capture chagnes in the form
    onHandleChange(event) {
        const name = event.target.getAttribute('name');
        this.setState({
            message: { ...this.state.message, [name]: event.target.value }
        });
    }

    //Handles Form Submission
    onSubmit(event) {
        event.preventDefault();
        this.setState({ submitting: true });
        fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state.message)
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              this.setState({
                error: false,
                submitting: false,
                message: {
                  to: '',
                  body: ''
                }
              });
            } else {
              this.setState({
                error: true,
                submitting: false
              });
            }
          });
      }

    // Main Render Method
    render() {
        return (
        <div>
          <img src="https://www.nicepng.com/png/detail/578-5789201_white-owl-cliparts-cartoon-owl.png" alt="Owlibaba" width="600" height="300"/>
          <form
            onSubmit={this.onSubmit}
            className={this.state.error ? 'error sms-form' : 'sms-form'}
          >
            <div style={divStyle}>
              <label htmlFor="to">Find the status of your order below!</label>
            </div>
            <div style={divStyle}>
              <label htmlFor="body">Order Number</label>
            </div>
            <div style={divStyle}>
              <textarea 
              name="body" 
              id="body"
              value={this.state.message.body}
              onChange={this.onHandleChange}/>
            </div>
            <button style={buttonStyle} type="submit">
                Send SMS Update
            </button>
          </form>
        </div>
        
        );
      }
}

export default SMSForm;