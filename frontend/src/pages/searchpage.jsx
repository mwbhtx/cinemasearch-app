import './searchpage-styles.css';
import '../styles/global-styles.css';
import { useEffect } from 'react';

import axios from 'axios';

// import asset images
import netflixImage from  '../assets/images/netflix.svg';
import huluImage from  '../assets/images/hulu.svg';
import hboImage from  '../assets/images/hbomax.svg';
import disneyImage from  '../assets/images/disneyplus.svg';


export default function SearchPage(props) {

    const onSubmitHandler = e => {
        e.preventDefault();

        console.log('I clicky the button...')

        axios.get('http://localhost:3002')
            .then(response => {
                console.log(response);
            }, rejected => {
                console.log(rejected);
            })
    }

    return (
        <div className='app-container'>

            <header className='nav-container'>
                <section className='banner-container'>
                    <section className='banner-leftside-content'>
                        <h4>CINEMA</h4>
                        <h4>SEARCH</h4>
                    </section>
                    <section className='banner-rightside-content'>
                        <h4>Seek and you shall find.</h4>
                        <h4>Movies / TV Shows / Documentaries</h4>
                    </section>
                </section>
                <form className='form-container' onSubmit={onSubmitHandler}>
                    <input className='search-input' type='text' placeholder='eg: Mr Robot'/>
                    <input className='submit-input' type='submit' value='search'/>
                </form>
            </header>

            <section className='results-section'>

                <h1 className='available-on-text'>AVAILABLE ON</h1>

                <section className='search-results-container'>
                    <StreamServiceComponent 
                    id='netflix-badge'
                    image={netflixImage}/>

                    <StreamServiceComponent 
                    id='hulu-badge'
                    image={huluImage}/>

                    <StreamServiceComponent 
                    id='hbomax-badge'
                    image={hboImage}/>

                    <StreamServiceComponent 
                    id='disneyplus-badge'
                    image={disneyImage}/>
                </section>
            </section>

            <footer className='footer-container'>
                <nav className='nav-links'>
                    <h4>NAVIGATION</h4>
                    <ul>
                        <li>HOME</li>
                        <li>ABOUT</li>
                        <li>PROJECTS</li>
                        <li>CONTACT</li>
                    </ul>
                </nav>
            </footer>
        </div>
    )
}

function StreamServiceComponent(props) {


    return (

        <>
            <div id={props.id} className='search-result-item'>
                <img src={props.image}/>
                <i className="fas fa-arrow-circle-right fa-2x"></i>
            </div>
        </>
    )
}