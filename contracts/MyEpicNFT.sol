// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// import B64 lib from our local dir
import { Base64 } from "./libraries/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract MyEpicNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint256 nftMintLimt = 99;
  string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";
  string[] firstWords  = ["Annoyed", "Gross", "Delighted", "Ominous", "Disheveled", "Filthy", "Graceful", "Homeless", "Docile", "Adamant", "Cosmic", "Holistic", "Mega", "Microscopic", "Lethargic", "Lost", "Determined"];
  string[] secondWords = ["Jungle", "Pavement", "Sandwich", "Ketchup", "Lime", "Cap", "Imp", "Camel", "Cactus", "Death", "Turkey", "Commando", "Pianist", "Scubadiver", "Baluga", "Seltzer", "Buldge", "Soul"];
  string[] thirdWords  = ["Skew", "Blasphemy", "Unite","Sprint", "Lift", "Karatechop", "Telekinetics", "Magic", "Creampie", "Destruction", "Fupa", "Volley", "Uppercut", "Trip", "Kamehameha", "Glide", "Rave", "Creation", "Devastation", "Manifest", "Calculate", "Brew"];  

  event NewEpicNFTMinted(address sender, uint256 tokenId);

  modifier checkMintLimit() {
    require(getTotalNFTsMintedSoFar() <= nftMintLimt);
    _;
  }

  constructor() ERC721("3WordsNFT", "3WORDS") {
    console.log("This is my NFT Contract. Nice!");
  }

  function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) { 
    //  create a RNG
    uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));

    rand = rand % firstWords.length;
    return firstWords[rand];
  }


  function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) { 
    //  create a RNG
    uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));

    rand = rand % secondWords.length;
    return secondWords[rand];
  }

  function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) { 
    //  create a RNG
    uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));

    rand = rand % thirdWords.length;
    return thirdWords[rand];
  }

  function random(string memory input) internal pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(input)));
  }

  function getTotalNFTsMintedSoFar() public view returns (uint256) {
    return _tokenIds.current();
  }


  function make3WordNFT() checkMintLimit public {
    uint256 newItemId = _tokenIds.current();

    string memory first  = pickRandomFirstWord(newItemId);
    string memory second = pickRandomSecondWord(newItemId);
    string memory third  = pickRandomThirdWord(newItemId);
    string memory combinedWord = string(abi.encodePacked(first, second, third));

    string memory finalSvg = string(abi.encodePacked(baseSvg, combinedWord, "</text></svg>"));
    
    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            combinedWord,
            '", "description": "A highly acclaimed collections of images composed of 3 words", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(finalSvg)),
            '"}'
          )
        )
      )
    );
    
    string memory finalTokenUri = string(
      abi.encodePacked("data:application/json;base64,", json)
    );
    
    console.log("\n--------------------------");
    console.log(finalSvg);
    console.log("--------------------------\n");

    // Actually mint the NFT to the sender using msg.sender.
    _safeMint(msg.sender, newItemId);

    // Set the NFTs data.
    _setTokenURI(newItemId, finalTokenUri);

    // Increment the counter for when the next NFT is minted.
    _tokenIds.increment();

    console.log("An NFT w/ ID %s has been minted %s", newItemId, msg.sender);
    emit NewEpicNFTMinted(msg.sender, newItemId);
  }
}