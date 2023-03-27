// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "./Int.sol";

contract FlashLoan is FlashLoanSimpleReceiverBase, Interface {
    address owner;
    enum Direction {
        Open,
        Close
    }

    constructor(address _PoolAddressesProvider)
        FlashLoanSimpleReceiverBase(
            IPoolAddressesProvider(_PoolAddressesProvider)
        )
    {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        //
        // This contract now has the funds requested.
        // Your logic goes here.
        //

        // At the end of your logic above, this contract owes
        // the flashloaned amount + premiums.
        // Therefore ensure your contract has enough to repay
        // these amounts.

        // Approve the Pool contract allowance to *pull* the owed amount
        (address asset2, Direction direction) = abi.decode(
            params,
            (address, Direction)
        );
        balance_text(asset, address(this), "asset before sell");
        if (direction == Direction.Open) {
            swapExactTokenForTokens(
                amount,
                asset,
                asset2,
                0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff
            );
            balance_text(asset, address(this), "asset after sell");
            uint256 asset2_bal = balance_text(
                asset2,
                address(this),
                "asset2 after sell"
            );

            supply(address(POOL), asset2, asset2_bal, address(this));
            uint256 BorrowSum = maxBorrowSum(
                address(POOL),
                asset2,
                asset,
                0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff
            );
            borrow(address(POOL), asset, (BorrowSum * 9) / 10);
        } else if (direction == Direction.Close) {
            swapExactTokenForTokens(
                amount,
                asset,
                asset2,
                0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff
            );
            repayFull(address(POOL), asset2);
            withdrawFull(address(POOL), asset);
        }
        balance_text(asset, address(this), "asset before fl repay");
        uint256 amountOwed = amount + premium;
        IERC20(asset).approve(address(POOL), amountOwed);
        return true;
    }

    function requestFlashLoan(
        address _token1,
        address _token2,
        uint256 _amount,
        Direction direction
    ) public onlyOwner {
        address receiverAddress = address(this);
        address asset = _token1;
        uint256 amount = _amount;
        bytes memory params = abi.encode(_token2, direction);
        uint16 referralCode = 0;

        POOL.flashLoanSimple(
            receiverAddress,
            asset,
            amount,
            params,
            referralCode
        );
        balance_text(_token1, address(this), "USDC after fl repay");
        balance_text(_token2, address(this), "USDT after fl repay");
      //  msg1();
    }

    receive() external payable {}
}
