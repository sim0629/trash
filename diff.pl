#!/usr/bin/perl

use Encode;
use HTTP::Request;
use LWP::UserAgent;
use Mojo::DOM;
use Try::Tiny;

my %ranks;

sub trim {
    my $string = shift;
    $string =~ s/^\s+//;
    $string =~ s/\s+$//;
    return $string;
}

sub fetch {
    my $result = "";
    my $request = HTTP::Request->new(GET => "http://graph.byb.kr");
    my $ua = LWP::UserAgent->new;
    $ua->agent("Mozilla/5.0");
    my $response = $ua->request($request);
    if ($response->is_success) {
        my $string = $response->decoded_content;
        my $dom = Mojo::DOM->new;
        $dom->parse($string);
        my $lis = $dom->find("#ranking .rankElement .data");
        my $rank = 0;
        foreach my $li (@$lis) {
            $rank++;
            my $nick = $li->at(".nick")->text;
            if (exists $ranks{$nick}) {
                if ($ranks{$nick} != $rank) {
                    my $change = $ranks{$nick} - $rank;
                    $result .= "$rank. $nick(";
                    $result .= "+" if($change > 0);
                    $result .= "$change) | ";
                }
            }
            $ranks{$nick} = $rank;
        }
    }
    return $result;
}

sub main {
    my $plain = Encode::decode("utf8", shift);
    $plain = trim($plain);
    my $result = count($plain);
    return "${plain} = ${result}";
}

sub event_privmsg {
    my ($server, $data, $nick, $address) = @_;
    my ($target, $text) = split(/ :/, $data, 2);
    $target = $nick if($target !~ /^#/);
    return unless($text =~ /count\?(.+)?/);
    $server->command("MSG ${target} ".main($+));
}

if(caller) {
    require Irssi;
    Irssi::signal_add("event privmsg", "event_privmsg");
}else {
    binmode(STDOUT, ":utf8");
    print fetch();
    #print main(@ARGV[0]);
    print "\n";
}
