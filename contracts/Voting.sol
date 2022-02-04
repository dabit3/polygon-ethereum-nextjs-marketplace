pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {

    // TODO: Emit these events
    event VoteCast(uint voteRoundId, address voter, uint orgId, uint weight);
    event VotingStarted(uint voteRoundId);
    event VotingEnded(uint voteRoundId);

    struct Vote {
        uint recipientOrg;
        uint weight;
        bool isExist; // Flag to differentiate between an actual vote and default empty struct in mapping
    }

    // staging -> gathering interest/registering organizations 
    enum VotingStage {
        STAGING, 
        IN_PROGRESS, 
        ENDED,
        PAID_OUT
    }

    struct VotingRoundDetails {
        uint votingStart;
        uint votingEnd;
        uint totalVotesCast;
        bool executed;
        string description;
        VotingStage stage;
        mapping(uint => bool) participatingOrgs;
        mapping(address => Vote) userVotes;
    }

    uint voteRoundCounter = 0;
    uint stagingPeriod = 3 days;  
    uint votingPeriod = 1 weeks;
    mapping(uint => VotingRoundDetails) votingRounds; 

    // Start a new round of voting, description can be used to describe the
    // category of organizations taking part, e.g "Animals" or "Elderly" (?) 
    // For now only owner can start a new round
    function newRound(string memory _description) external onlyOwner() {
        voteRoundCounter++;
        uint newRoundId = voteRoundCounter;
        uint voteStartTime = block.timestamp + stagingPeriod;

        votingRounds[newRoundId].votingStart = voteStartTime;
        votingRounds[newRoundId].votingEnd = voteStartTime + votingPeriod;
        votingRounds[newRoundId].description = _description;
        votingRounds[newRoundId].stage = VotingStage.STAGING;
    }

    function registerOrg(uint _voteRoundId, uint _orgId) external onlyOwner() {
        require(votingRounds[_voteRoundId].stage == VotingStage.STAGING, "Orgs can only be registered during the staging period"); 
        votingRounds[_voteRoundId].participatingOrgs[_orgId] = true;
    }

    // TODO: How to accept donation?
    // Make the vote function itself payable? make user exchange for token?
    function vote(uint _voteRoundId, uint _orgId) external {
        require(votingRounds[_voteRoundId].stage == VotingStage.IN_PROGRESS, "Votes can only be cast if voting is still in progress");
        require(_canVote(_voteRoundId, msg.sender), "User not allowed to vote in this round");
        require(_isValidOrg(_voteRoundId, _orgId), "Not a valid organization id");
        require(_hasNotVoted(_voteRoundId, msg.sender), "User has already voted before");

        VotingRoundDetails storage currRound = votingRounds[_voteRoundId];
        
        // TODO: Do some vote weight calculation here (or do we even need this concept of weight?)
        uint voteWeight = 1;
        currRound.userVotes[msg.sender] = Vote(_orgId, voteWeight, true);
        currRound.totalVotesCast++;
    }

    function _canVote(uint _voteRoundId, address _user) private pure returns(bool) {
        // TODO: Implement voting permission check 
        return _voteRoundId == _voteRoundId && _user == _user;
    }

    function _hasNotVoted(uint _voteRoundId, address _user) private view returns(bool) {
        return !votingRounds[_voteRoundId].userVotes[_user].isExist;
    }

    function _isValidOrg(uint _voteRoundId, uint _orgId) private view returns(bool) {
        return votingRounds[_voteRoundId].participatingOrgs[_orgId];
    }
}