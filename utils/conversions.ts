export function uuidToUint256(uuid: string): bigint {
    const cleanUuid = uuid.replace(/-/g, '').toLowerCase();
  
    const bigIntValue = BigInt(`0x${cleanUuid}`);
  
    const uint256Max = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    const uint256Value = bigIntValue & uint256Max;
  
    return uint256Value;
  }

export function uint256ToUuid(uint256Value: bigint): string {
    let hexString = uint256Value.toString(16);
  
    hexString = hexString.padStart(32, '0');
  
    const uuid = [
      hexString.substring(0, 8),
      hexString.substring(8, 12),
      hexString.substring(12, 16),
      hexString.substring(16, 20),
      hexString.substring(20)
    ].join('-');
  
    return uuid;
  }