import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { filterCardsAction } from '../actions/cardActions';
import { searchCardsAction } from '../actions/cardActions';


class Tag extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props.tagName, ' <---> ', props.card_count);
  }

  render() {
    return (
        <a className="collection-item" onClick={() => this.props.searchCards(this.props.tagName)}>
          {this.props.tagName}
          <span className="badge">{this.props.card_count}</span>
        </a>
    );
  }
};

// const mapStateToProps = (state) => {
//   return {
//     cards: state.cards
//   };
// }

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({searchCards: searchCardsAction}, dispatch);
  // return bindActionCreators({filterCards: filterCardsAction}, dispatch);
};

export default connect(null, mapDispatchToProps)(Tag);

// <div className="tag">
//     <span>#{props.name}</span>
// </div>
