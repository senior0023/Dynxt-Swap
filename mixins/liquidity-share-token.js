import web3Service from "../web3"

export default {
  async getExistTokenPair(fromToken, toToken, getRate) {
    let existTokenPair = "";
    let rateBNBToDYNXT = 0;
    let rateDYNXTToBNB = 0;

    if (fromToken > 0 && toToken > 0) {
      existTokenPair = await web3Service.findLPPairs(fromToken, toToken);
      if (existTokenPair === undefined) {
        existTokenPair = ""
      }
    }

    if (existTokenPair != "0x0000000000000000000000000000000000000000") {
      // TODO: change with tokens
      rateBNBToDYNXT = web3Service.toPlainString(1 / getRate).slice(0, 14);
      rateDYNXTToBNB = web3Service.toPlainString(getRate).slice(0, 14);
    }

    return {existTokenPair, rateBNBToDYNXT, rateDYNXTToBNB};
  },

  async getLPThings(existTokenPair, currentAddr, axios, params) {
    const walletState = await axios.$get('https://deep-index.moralis.io/api/v2/' + currentAddr + '/erc20', {
      params: params
    })

    let lpItem = null
    let lpState = null
    let totalSupplyLPTokens = 0
    let mineLPTokens = 0
    let tokenAaddr = ""
    let tokenAbalance = 0
    let tokenBaddr = ""
    let tokenBbalance = 0
    
    if (existTokenPair != undefined && existTokenPair != "") {
      lpItem = walletState.filter(val => {
        return val.token_address.toLowerCase() == existTokenPair.toLowerCase()
      })

      if (lpItem != null && lpItem != '' && lpItem != undefined) {
        mineLPTokens = (lpItem[0].balance / 1000000000000000000).toString().slice(0,8);
      }
      
      totalSupplyLPTokens = ((await web3Service.getTotalLPSupplyTokens(existTokenPair)) / 1000000000000000000).toFixed(6)

      lpState = await this.getLPWalletWithAddress(existTokenPair, axios, params);
      tokenAaddr = lpState[0].token_address
      tokenAbalance = lpState[0].balance / 1000000000000000000
      tokenBaddr = lpState[1].token_address
      tokenBbalance = lpState[1].balance / 1000000000000000000
    }

    return {totalSupplyLPTokens, mineLPTokens, tokenAaddr, tokenAbalance, tokenBaddr, tokenBbalance}
  },
  
  async getLPWalletWithAddress(lpAddress, axios, params) {
    const lpState = await axios.$get('https://deep-index.moralis.io/api/v2/' + lpAddress + '/erc20', {
      params: params
    })

    return lpState;
  },

  async findAllMineLPPairs(allPairs, currentAddr, axios, params) {
    const walletState = await axios.$get('https://deep-index.moralis.io/api/v2/' + currentAddr + '/erc20', {
      params: params
    })

    let lpItem = null
    let lpState = null
    let totalSupplyLPTokens = 0
    let mineLPTokens = 0
    let mineLPs = []

    let existTokenPair = ""
    for (let i = 0; i < allPairs.length; i++) {
      existTokenPair = allPairs[i]
      
      lpItem = walletState.filter(val => {
        return val.token_address.toLowerCase() == existTokenPair.toLowerCase()
      })

      totalSupplyLPTokens = ((await web3Service.getTotalLPSupplyTokens(existTokenPair)) / 1000000000000000000).toFixed(6)

      if (lpItem != null && lpItem != '' && lpItem != undefined) {
        mineLPTokens = (lpItem[0].balance / 1000000000000000000).toString().slice(0,8);
        lpState = await this.getLPWalletWithAddress(existTokenPair, axios, params);

        let fromToken = 0;
        let toToken = 0;
        let fromTokenName = "";
        let toTokenName = "";
        let fromTokenItem = web3Service.tokenLists.filter(x => x.addr.toLowerCase() == lpState[0].token_address.toLowerCase())
        if (fromTokenItem.length > 0) {
          fromToken = fromTokenItem[0].id
          fromTokenName = fromTokenItem[0].name
        }
        let toTokenItem = web3Service.tokenLists.filter(x => x.addr.toLowerCase() == lpState[1].token_address.toLowerCase())
        if (toTokenItem.length > 0) {
          toToken = toTokenItem[0].id
          toTokenName = toTokenItem[0].name
        }

        let shareOfPool = (mineLPTokens / totalSupplyLPTokens * 100).toFixed(2)

        mineLPs.push({
          lpAddress: existTokenPair,
          totalSupplyLPTokens: totalSupplyLPTokens,
          mineLPTokens: mineLPTokens,
          shareOfPool: shareOfPool,
          fromToken: fromToken,
          toToken: toToken,
          fromTokenName: fromTokenName,
          toTokenName: toTokenName,
          tokenAaddr: lpState[0].token_address,
          tokenAbalance: lpState[0].balance / 1000000000000000000,
          tokenBaddr: lpState[1].token_address,
          tokenBbalance: lpState[1].balance / 1000000000000000000,
        })
      }
    }

    return mineLPs
  },

  vuetifyNumber(val) {
    const newval = web3Service.toPlainString(val)
    if(newval<1) {
      const res = newval.slice(0, Math.ceil(Math.abs(Math.log10(parseFloat(val))))+6)
      return res.length>1 && res.slice(-1) === "0" ? res.slice(0, res.length-1):res
    }
    else{
      return newval.split(".").map((val, index)=>{
        if(index>0) {
          return val.slice(0, 4)
        }
        return val
      }).join(".")
    }
  },
}