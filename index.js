// const fs = require('fs');

// const exp_referral_improvements = fs.readFileSync('exp_referral_improvements.txt');
// const exp_link_from_confirm_to_referral = fs.readFileSync('exp_link_from_confirm_to_referral.txt');

const lineReader = require('line-reader');

const exp_referral_improvements = [];
const exp_link_from_confirm_to_referral = [];
const royalty = [];

lineReader.eachLine('exp_referral_improvements.txt', function(line, last) {
    exp_referral_improvements.push(line.split(','));
    if (last) {
        lineReader.eachLine('exp_link_from_confirm_to_referral.txt', function(
            line,
            last,
        ) {
            exp_link_from_confirm_to_referral.push(line.split(','));
            if (last) {
                lineReader.eachLine('royalty.txt', function(line, last) {
                    royalty.push(line.split(','));
                    if (last) {
                        handle();
                    }
                });
            }
        });
    }
});

const sumRoyalty = royalty =>
    royalty.reduce((sum, r) => sum + parseFloat(r[3]), 0);

const handle_exp = (exp_data, royalty) => {
    const userIDsA = exp_data
        .filter(line => line[2] === '"A"')
        .map(line => line[0]);
    const userIDsB = exp_data
        .filter(line => line[2] === '"B"')
        .map(line => line[0]);
    const royaltyA = royalty.filter(line => userIDsA.indexOf(line[1]) > -1);
    const royaltyB = royalty.filter(line => userIDsB.indexOf(line[1]) > -1);
    console.log(
        'A:',
        'Group Size:',
        userIDsA.length,
        '\tN of payments:',
        royaltyA.length,
        '\tTotal $:',
        sumRoyalty(royaltyA),
    );
    console.log(
        'B:',
        'Group Size:',
        userIDsB.length,
        '\tN of payments:',
        royaltyB.length,
        '\tTotal $:',
        sumRoyalty(royaltyB),
    );
    console.log(
        'Diff:',
        (
            (100 * (sumRoyalty(royaltyB) - sumRoyalty(royaltyA))) /
            sumRoyalty(royaltyA)
        ).toFixed(2) + '%',
    );
};

const handle_both_exp = (exp_data1, exp_data2, royalty) => {
    const userIDs1A = exp_data1
        .filter(line => line[2] === '"A"')
        .map(line => line[0]);
    const userIDs1B = exp_data1
        .filter(line => line[2] === '"B"')
        .map(line => line[0]);
    const userIDs2A = exp_data2
        .filter(line => line[2] === '"A"')
        .map(line => line[0]);
    const userIDs2B = exp_data2
        .filter(line => line[2] === '"B"')
        .map(line => line[0]);
    const royaltyAA = royalty.filter(
        line =>
            userIDs1A.indexOf(line[1]) > -1 && userIDs2A.indexOf(line[1]) > -1,
    );
    const royaltyAB = royalty.filter(
        line =>
            userIDs1A.indexOf(line[1]) > -1 && userIDs2B.indexOf(line[1]) > -1,
    );
    const royaltyBA = royalty.filter(
        line =>
            userIDs1B.indexOf(line[1]) > -1 && userIDs2A.indexOf(line[1]) > -1,
    );
    const royaltyBB = royalty.filter(
        line =>
            userIDs1B.indexOf(line[1]) > -1 && userIDs2B.indexOf(line[1]) > -1,
    );
    console.log(
        'AA:',
        '\tN of payments:',
        royaltyAA.length,
        '\tTotal $:',
        sumRoyalty(royaltyAA),
    );
    console.log(
        'AB:',
        '\tN of payments:',
        royaltyAB.length,
        '\tTotal $:',
        sumRoyalty(royaltyAB),
    );
    console.log(
        'BA:',
        '\tN of payments:',
        royaltyBA.length,
        '\tTotal $:',
        sumRoyalty(royaltyBA),
    );
    console.log(
        'BB:',
        '\tN of payments:',
        royaltyBB.length,
        '\tTotal $:',
        sumRoyalty(royaltyBB),
    );
};

const handle = () => {
    // console.log(exp_referral_improvements.length, exp_referral_improvements[0]);
    // console.log(
    //  exp_link_from_confirm_to_referral.length,
    //  exp_link_from_confirm_to_referral[0],
    // );
    console.log('exp_referral_improvements');
    handle_exp(exp_referral_improvements, royalty);
    console.log('exp_link_from_confirm_to_referral');
    handle_exp(exp_link_from_confirm_to_referral, royalty);
    console.log('both');
    handle_both_exp(
        exp_referral_improvements,
        exp_link_from_confirm_to_referral,
        royalty,
    );
};
