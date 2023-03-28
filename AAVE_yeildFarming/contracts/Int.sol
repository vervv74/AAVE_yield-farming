// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";

interface AAVE {
    function getUserAccountData(address user)
        external
        view
        returns (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            uint256 availableBorrowsBase,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        );

    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);

    function borrow(
        address asset,
        uint256 amount,
        uint256 interestRateMode,
        uint16 referralCode,
        address onBehalfOf
    ) external;

    function repay(
        address asset,
        uint256 amount,
        uint256 interestRateMode,
        address onBehalfOf
    ) external returns (uint256);
}

interface QuickswapRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function getAmountsOut(uint256 amountIn, address[] memory path)
        external
        view
        returns (uint256[] memory amounts);
}

contract Interface {
    function msg1() public returns (address){
       
       console.log("msg.sender %s ", msg.sender);
       return msg.sender;
    }

    function balance(address _token, address acc)
        public
        view
        returns (uint256)
    {
        uint256 qwe = IERC20(_token).balanceOf(acc);
        console.log("balance %s %s", _token, qwe);
        return qwe;
    }

    function balance_text(
        address _token,
        address acc,
        string memory text
    ) public view returns (uint256) {
        uint256 qwe = IERC20(_token).balanceOf(acc);
        console.log("balance %s %s", qwe, text);
        return qwe;
    }

    function transferFrom(
        address _token,
        address sender,
        address dst,
        uint256 wad
    ) public returns (bool) {
        // if contract is msg.sender but not sender
        console.log("transfer %s", wad);
        return IERC20(_token).transferFrom(sender, dst, wad);
    }

    function transfer(
        address _token,
        address receiver,
        uint256 amount
    ) public returns (bool) {
        console.log("transfer %s", amount);
        return IERC20(_token).transfer(receiver, amount);
    }

    ///AAVE
    function getUserAccountData(address Pool, address user)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        IPool ipool = IPool(Pool);
        //    console.log("data %s", user);
        return ipool.getUserAccountData(user);
    }

    function supply(
        address Pool,
        address asset,
        uint256 amount,
        address onBehalfOf
    ) public {
        IERC20(asset).approve(Pool, amount);
        IPool ipool = IPool(Pool);
        console.log("supplyed %s", amount);
        ipool.supply(asset, amount, onBehalfOf, 0);
    }

    function withdraw(
        address Pool,
        address asset,
        uint256 amount,
        address to
    ) public returns (uint256) {
        IPool ipool = IPool(Pool);
        console.log("withdrawed %s", amount);
        ipool.withdraw(asset, amount, to);
    }

    function withdrawFull(address Pool, address asset)
        public
        returns (uint256)
    {
        IPool ipool = IPool(Pool);
        console.log("withdrawed %s", type(uint256).max);
        ipool.withdraw(asset, type(uint256).max, address(this));
    }

    function borrow(
        address Pool,
        address asset,
        uint256 amount
    ) public {
        IPool ipool = IPool(Pool);
        console.log("borrowed %s  sender %s", amount, address(this));
        ipool.borrow(asset, amount, 1, 0, address(this));
    }

    function repay(
        address Pool,
        address asset,
        uint256 amount
    ) public {
        IERC20(asset).approve(Pool, amount);
        IPool ipool = IPool(Pool);
        ipool.repay(asset, amount, 1, address(this));
    }

    function repayFull(address Pool, address asset) public {
        IERC20(asset).approve(Pool, type(uint256).max);
        IPool ipool = IPool(Pool);
        ipool.repay(asset, type(uint256).max, 1, address(this));
    }

    function maxBorrowSum(
        address Pool,
        address supplyAsset,
        address borrowAsset,
        address Router
    ) public view returns (uint256) {
        //define maxBorrow for current supply
        IPool ipool = IPool(Pool);
        (
            uint256 qwe0,
            uint256 qwe1,
            uint256 qwe2,
            uint256 qwe3,
            uint256 qwe4,
            uint256 qwe5
        ) = ipool.getUserAccountData(address(this));
        /* console.log("supplySum %s", qwe0 );
        console.log("borrowSum %s", qwe1 );
        console.log("reserve %s", qwe2 );
        console.log("maxRate %s", qwe3 );
        console.log("realRate %s", qwe4 ); */
        uint256 qwe16 = getAmountsOut(
            qwe2 / 100,
            supplyAsset,
            borrowAsset,
            Router
        );
        console.log("maxBorrowSum %s", qwe16);
        return qwe16;
    }

    function closeSum(
        address Pool,
        address openAsset, //USDC
        address supplyAsset, //USDT
        address Router
    ) public view returns (uint256) {
        IPool ipool = IPool(Pool);
        (
            uint256 qwe0,
            uint256 qwe1,
            uint256 qwe2,
            uint256 qwe3,
            uint256 qwe4,
            uint256 qwe5
        ) = ipool.getUserAccountData(address(this));
        uint256 qwe16 = getAmountsOut(
            qwe1 / 100,
            openAsset,
            supplyAsset,
            Router
        );
        uint256 qwe17 = (qwe16 * 105) / 100;
        console.log(
            "borrowSum %s, minSellSum %s, sumToCloseFL %s",
            qwe1 / 100,
            qwe16,
            qwe17
        );
        return qwe17;
    }

    //Quickswap
    function swapExactTokenForTokens(
        uint256 amountIn,
        address token0,
        address token1,
        address Router
    ) public returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = token0;
        path[1] = token1;
        IERC20(token0).approve(Router, amountIn);
        uint256[] memory amounts = QuickswapRouter(Router)
            .swapExactTokensForTokens(
                amountIn,
                0,
                path,
                address(this),
                block.timestamp + 1000
            );
        console.log("amountout %s", amounts[1]);
        return amounts[1];
    }

    function getAmountsOut(
        uint256 amountIn,
        address token0,
        address token1,
        address Router
    ) public view returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = address(token0);
        path[1] = address(token1);
        uint256[] memory amounts = QuickswapRouter(Router).getAmountsOut(
            amountIn,
            path
        );
        console.log("amount0 %s", amounts[0]);
        console.log("amount1 %s", amounts[1]);
        return amounts[1];
    }
}
