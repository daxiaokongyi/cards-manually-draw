import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Card from './Card';
import './Deck.css';

const API_BASE_URL = "https://deckofcardsapi.com/api/deck/";

const Deck = () => {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [click, setClick] = useState(false);

    useEffect(() => {
        const getDeck = async () => {
            let deckRes = await axios.get(`${API_BASE_URL}/new/shuffle`);
            setDeck(deckRes.data);
        }
        getDeck();
    }, [setDeck]);

    useEffect(() => {
        // set drawCard function to get a card each time
        const drawCard = async () => {
            let {deck_id} = deck;
            try {
                let cardRes = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`)

                // check if the card is the last one
                if(cardRes.data.remaining === 0) {
                    setClick(false);
                    throw new Error("No more cards")
                }

                // get the current card's information
                const currentCard = cardRes.data.cards[0];
                // const currentCard = cardRes.data 
                setDrawn(cards => [...cards, 
                    {
                        id : currentCard.code,
                        name : currentCard.suit + " " + currentCard.value,
                        image: currentCard.image
                     }
                ]);
            } catch (error) {
                alert(error);              
            }
        }

        if (click === true) {
            drawCard();
        }

        return () => {
            setClick(false);
        }

    }, [click, setClick, deck]);

    const handleClick = () => {
        setClick(true);
    }

    const cards = drawn.map(each => (
        <Card key={each.id} name={each.name} image={each.image}/>
    ));

    return (
        <div className="Deck">
            <button className="Deck-gimme" onClick={handleClick}>Gimme Me A Card</button>
            <div className="Deck-cardarea">{cards}</div>
        </div>
    )
}

export default Deck;