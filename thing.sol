// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PredictionEmitter {
    struct Prediction {
        uint256 userId;
        bytes32[6] predictionText;
        uint256 timestamp;
    }

    event PredictionMade(uint256 indexed id, uint256 userId, bytes32[6] predictionText, uint256 timestamp);

    mapping(uint256 => Prediction) private predictions;

    uint256 private nextId = 0;

    function emitPrediction(uint256 _userId, bytes32[6] calldata _predictionText) public {
        predictions[nextId] = Prediction({
            userId: _userId,
            predictionText: _predictionText,
            timestamp: block.timestamp
        });

        // Emit the PredictionMade event
        emit PredictionMade(nextId, _userId, _predictionText, block.timestamp);

        // Increment the nextId
        nextId++;
    }

    function getPredictionById(uint256 _id) public view returns (uint256 userId, bytes32[6] memory predictionText, uint256 timestamp) {
        Prediction memory prediction = predictions[_id];
        return (prediction.userId, prediction.predictionText, prediction.timestamp);
    }

    function getNextId() public view returns (uint256) {
        return nextId;
    }
}
