import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Card from '../components/Card';
import { fetchCardsAction } from '../actions/cardActions';

class AllCardsContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchCards();
    setTimeout(() => {
      const intervalId = setInterval(() => {
        if (!this.props.search.input) {
          this.props.fetchCards();
        }
      }, 2000);
      localStorage.setItem('intervalId', intervalId);
    }, 100); // TODO: we need to figure out a solution to dispatch actions asyncly.
  }

  render() {
    return (
      <div>
        {this.props.cards.map((card) =>
          <Card
            key={card.id}
            {...card} id={card.id} />
        )}
      </div>
    )
  };
};

const mapStateToProps = (state) => {
  return {
    cards: state.cards,
    search: state.search
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({fetchCards: fetchCardsAction}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AllCardsContainer);
