#!/usr/bin/perl

use HTTP::Request;
use LWP::UserAgent;
use Mojo::DOM;
use Try::Tiny;

sub trim {
    my $string = shift;
    $string =~ s/^\s+//;
    $string =~ s/\s+$//;
    return $string;
}

sub count {
    my $realname = shift;
    my $request = HTTP::Request->new(GET => "http://graph.byb.kr");
    my $ua = LWP::UserAgent->new;
    $ua->agent("Mozilla/5.0");
    my $response = $ua->request($request);
    if ($response->is_success) {
        my $string = $response->decoded_content;
        my $dom = Mojo::DOM->new;
        $dom->parse($string);
        my @lis = $dom->find("ol > li")->pluck("text")->each;
        my $name = $dom->at("ol > li")->all_text;
        if($name eq $realname) {
            return "ingyeo";
        }
        my $count = "unknown";
        my $my_count;
        my $break = 0;
        foreach my $li (@lis) {
            if($li =~ /(\S+)\s*:\s*(\d+)/) {
                if($realname eq $1) {
                    $my_count = $2;
                    $break = 1;
                    last;
                }
                $name = $1;
                $count = $2;
            }
        }
        if($count eq "unknown") {
            return $name." -x";
        }elsif($break == 1) {
            return $name." -".($count - $my_count);
        }else {
            return "none";
        }
    }
    return "fail";
}

sub main {
    my $plain = shift;
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
    print main(@ARGV[0]);
    print "\n";
}
