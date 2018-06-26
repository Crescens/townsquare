import React from 'react';

import Link from './Link.jsx';

class About extends React.Component {
    render() {
        return (
            <div className='about-box'>
                <a className='btn btn-danger btn-lg pull-right' href='https://bitbucket.org/Blargg/townsquare/issues' target='_blank'>Report Problems</a>
                <h2>Help and Information</h2>

                <h3>What is this?</h3>

                <p>Play Doomtown: Reloaded, online!</p>

                <h3>How do I play?</h3>
                <p>Registering for an account or logging in if you already have one.  You must be logged in to play games or spectate on them.
                Once you're logged in, go to the <Link href='/decks'>decks page.</Link>  You can create a deck by going to <a href='http://dtdb.co' target='_blank'>Doomtown DB</a>,
                 clicking on the button to download your deck to a TXT file and copy/pasting it into the deck builder.  Then either join or create a game and you're good to go.</p>


                <h3>Why doesn't xyz work?</h3>
                <p>Because stuff is hard! We'll try to get to eventually!</p>
                <p>If you do encounter a bug or issue which is not related to a missing or not implemented card
                then please do report it. Please include as much information as possible, including what the problem is, what you were expecting, 
                what you did leading up to it, and if possible include a screenshot.  We are a very small development team and if bugs are not reported, it is unlikely they will get fixed.</p>

                <h3>Manual Commands</h3>
                <p>The following manual commands have been implemented in order to allow for a smoother gameplay experience:
                </p>
                <ul>
                    <li>/draw x - Draws x cards from your deck to your hand</li>
                    <li>/drawhand x - Draws x cards from your deck to your draw hand</li>

                    <li>/revealdraw (or /rd) - Reveal draw hand</li>
                    <li>/discarddraw (or /dd) - Discard draw hand</li>
                    
                    <li>/chip t x  (or /counter or /c) - Set the chip count of a card of type 't' to 'x'. Currently used chips are: 'control', 'influence', 'bounty', 'production' and 'ghostrock'</li>
                    <li>/token t  - Create a token of type 't' and add it to your hand. Currently used types are: 'gunslinger'/'g', 'ancestorspirit'/'a', 'naturespirit'/'n'</li>                

                    <li>/cancel-prompt - Clear the current prompt and resume the game flow.  Use with caution and only when the prompt is 'stuck' and you are unable to continue</li>
                    
                    <li>/give-control - Give control of a card to your opponent.  Use with caution</li>
                    
                </ul>

                <h3>Can I help?</h3>
                <p>Sure!  Talk to Blargg!</p>
                

                <h2>Special Thanks</h2>
                <p>Thank you to the Throneteki team! The code from their project was a vital building block for this toy <a href='https://github.com/throneteki/throneteki' target='_blank'>Throneteki Github</a></p>

                <h2>Additional Notes</h2>
                <p>Doomtown: Reloaded and Deadlands, names, images, and artwork are all copyright <a href='https://www.peginc.com/' target='_blank'>Pinnacle Entertainment Group</a>.</p>
            </div>
        );
    }
}

About.displayName = 'About';
About.propTypes = {
};

export default About;
