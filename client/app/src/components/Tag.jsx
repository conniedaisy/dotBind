import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { filterCardsAction } from '../actions/cardActions';
import { searchCardsAction, searchCardsByTagAction } from '../actions/cardActions';
// import { switchDisplayAction } from '../actions/searchActions';
import { addSearchKeywordAction } from '../actions/searchActions';


class Tag extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props.tagName, ' <---> ', props.card_count);
  }

  render() {
    return (
        <a className="collection-item" onClick={() => {

          let searchString = '';
          if (this.props.search) {
            searchString = searchString.concat(this.props.search.input, ' ', this.props.tagName)
          } else {
            searchString = searchString.concat(this.props.tagName)
          }
          console.log('searchString in tag', searchString);
          this.props.searchCardsByTag(searchString);
          this.props.addSearchKeyword(false, this.props.tagName);
        }}>
          {this.props.tagName}
          <span className="badge">{this.props.card_count}</span>
        </a>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    search: state.search
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    // searchCards: searchCardsAction,
    // switchDisplay: switchDisplayAction
    addSearchKeyword: addSearchKeywordAction,
    searchCardsByTag: searchCardsByTagAction,
  }, dispatch);
  // return bindActionCreators({filterCards: filterCardsAction}, dispatch);
};

export default connect(null, mapDispatchToProps)(Tag);

// <div className="tag">
//     <span>#{props.name}</span>
// </div>
