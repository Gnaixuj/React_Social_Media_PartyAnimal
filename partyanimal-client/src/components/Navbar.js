import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// MUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

class Navbar extends Component {
    render() {
        return (
            <div>
                <AppBar>
                    <Toolbar className="navbar">
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default Navbar
