import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Comment extends Component {
    static propTypes = {
        comment: PropTypes.object.isRequired
    }
    constructor() {
        super()
        this.state = {
            timeString: ''
        }
    }
    componentWillMount() {
        this._updateTimeString()
        this._timer = setInterval(this._updateTimeString.bind(this), 5000)
    }
    componentWillUnmount() {
        clearInterval(this._timer)
    }
    _updateTimeString() {
        const comment = this.props.comment
        const duration = (+Date.now() - comment.createdTime) / 1000
        let timeString
        if (duration < 60) {
            timeString = `${Math.round(Math.max(duration, 1))} 秒前`
        } else if (duration <= 3600) {
            timeString = `${Math.round(duration / 60)} 分钟前`
        } else {
            const hour = Math.floor(duration / 3600)
            const minute = Math.round((duration % 3600) / 60)
            timeString = `${hour} 小时 ${minute} 分钟前`
        }
        this.setState({
            timeString: timeString
        })
    }
    _getProcessedContent(content) {
        return content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#309;')
            .replace(/`([\S\s]+?)`/g, '<code>$1</code>')

    }
    handleDeleteComment() {
        if (this.props.onDeleteComment) {
            this.props.onDeleteComment(this.props.index)
        }
    }
    render() {
        return (
            <div className='comment'>
      <div className='comment-user'>
        <span>{this.props.comment.username} </span>： 
      </div>
      <p dangerouslySetInnerHTML={{
                __html: this._getProcessedContent(this.props.comment.content)
            }}></p>
      <span className="comment-createdtime">{this.state.timeString}</span>
      <span className="comment-delete" onClick={this.handleDeleteComment.bind(this)}>删除</span>
    </div>
        )
    }
}

export default Comment