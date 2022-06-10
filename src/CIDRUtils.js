import IpSubnetCalculator from 'ip-subnet-calculator'

function isNumber(n){
    try {
        let pi = parseFloat(n)
        return !isNaN(pi)
    }catch(e){
        return false
    }
}

function do_validation(cidr){
    const cidrsplit = cidr.split('/')
    if (cidrsplit.length !== 2 
        || !IpSubnetCalculator.isIp(cidrsplit[0])
        || !isNumber(cidrsplit[1])) {
        throw new Error('Invalid CIDR')
    }
}
function CIDRUtils(){
    return {
        isNumber: (n) => {
            return isNumber(n)
        },
        validate: (cidr) => {
            do_validation(cidr)
        },
        range: (cidr) => {
            do_validation(cidr)
            
            const [ipspace, mask] = cidr.split('/')
            const calcSubnet = IpSubnetCalculator.calculateSubnetMask(ipspace, mask)
            return { 
                'ipMin': calcSubnet.ipLowStr,
                'ipMax': calcSubnet.ipHighStr,
                'ipAvailable': (calcSubnet.ipHigh - calcSubnet.ipLow)+1 
            } //[ JSON.stringify(calcSubnet, null, 2), (calcSubnet.ipHigh - calcSubnet.ipLow)+1  ]

        },
        isInRange: (ip, cidr) => {
            do_validation(ip)
            do_validation(cidr)
            const [ipspace, mask] = ip.split('/')
            const calcSubnet = IpSubnetCalculator.calculateSubnetMask(ipspace, mask)
            const ip_r = { 
                'ipMin': calcSubnet.ipLow,
                'ipMax': calcSubnet.ipHigh,
                'ipAvailable': (calcSubnet.ipHigh - calcSubnet.ipLow)+1 
            }
            const [ipspace2, mask2] = cidr.split('/')
            const calcSubnet2 = IpSubnetCalculator.calculateSubnetMask(ipspace2, mask2)
            const cidr_r = { 
                'ipMin': calcSubnet2.ipLow,
                'ipMax': calcSubnet2.ipHigh,
                'ipAvailable': (calcSubnet.ipHigh - calcSubnet.ipLow)+1 
            }
            return ( ip_r.ipMin >= cidr_r.ipMin && 
                     ip_r.ipMin <= cidr_r.ipMax && 
                     ip_r.ipMax <= cidr_r.ipMax )

        }
    }
}

export default CIDRUtils;